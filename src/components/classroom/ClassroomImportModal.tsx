import { useState, useEffect, useCallback } from 'react';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
import { isGoogleClassroomConfigured } from '@/lib/env';
import {
  GoogleClassroomProvider,
  type ClassroomCourse,
  type ClassroomAssignmentImport,
} from '@/lib/classroom';
import type { Subject } from '@/types';
import {
  X,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  KeyRound,
  FileText,
  Sparkles,
  LogOut,
} from 'lucide-react';

interface ClassroomImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
  subjects: Subject[];
}

export function ClassroomImportModal({
  isOpen,
  onClose,
  onImportComplete,
  subjects,
}: ClassroomImportModalProps) {
  const repo = useRepository();
  const { session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Google Classroom OAuth State
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [coursework, setCoursework] = useState<ClassroomAssignmentImport[]>([]);
  const [selectedAssignmentIndices, setSelectedAssignmentIndices] = useState<Set<number>>(new Set());
  const [targetSubjectId, setTargetSubjectId] = useState<string>('');

  // Quick Text fallback
  const [activeTab, setActiveTab] = useState<'google-api' | 'quick-paste'>('google-api');
  const [pastedText, setPastedText] = useState('');

  const isConfigured = isGoogleClassroomConfigured();

  // Ensure targetSubjectId always syncs to a valid subject
  useEffect(() => {
    if (subjects.length > 0) {
      if (!targetSubjectId || !subjects.some((s) => s.id === targetSubjectId)) {
        setTargetSubjectId(subjects[0].id);
      }
    }
  }, [subjects, targetSubjectId]);

  const loadCourseAssignments = useCallback(
    async (courseId: string, courseList: ClassroomCourse[]) => {
      setSelectedCourseId(courseId);
      setIsLoading(true);
      setError(null);
      try {
        const provider = new GoogleClassroomProvider();
        const cwList = await provider.importAssignments(courseId);
        setCoursework(cwList);
        setSelectedAssignmentIndices(new Set(cwList.map((_, i) => i)));

        // Try to auto-match target subject strictly by classroom code or course ID
        const selectedCourse = courseList.find((c) => c.id === courseId);
        if (selectedCourse && subjects.length > 0) {
          const match = subjects.find(
            (s) =>
              s.classroomCode &&
              ((selectedCourse.enrollmentCode &&
                s.classroomCode.trim().toLowerCase() === selectedCourse.enrollmentCode.trim().toLowerCase()) ||
               (selectedCourse.id &&
                s.classroomCode.trim().toLowerCase() === selectedCourse.id.trim().toLowerCase()))
          );
          if (match) {
            setTargetSubjectId(match.id);
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course assignments');
      } finally {
        setIsLoading(false);
      }
    },
    [subjects]
  );

  const handleConnectGoogle = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleClassroomProvider();
      await provider.requestAccessToken(force);
      const courseList = await provider.listCourses();
      setCourses(courseList);

      if (courseList.length > 0) {
        // Try to match the first available course with a subject by code or ID
        let initialCourseId = courseList[0].id;
        for (const c of courseList) {
          const matched = subjects.find(
            (s) =>
              s.classroomCode &&
              ((c.enrollmentCode &&
                s.classroomCode.trim().toLowerCase() === c.enrollmentCode.trim().toLowerCase()) ||
               (c.id &&
                s.classroomCode.trim().toLowerCase() === c.id.trim().toLowerCase()))
          );
          if (matched) {
            initialCourseId = c.id;
            setTargetSubjectId(matched.id);
            break;
          }
        }
        await loadCourseAssignments(initialCourseId, courseList);
      }
    } catch (err: unknown) {
      const provider = new GoogleClassroomProvider();
      provider.clearToken();
      setCourses([]);
      setError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  }, [loadCourseAssignments, subjects]);

  const handleAutoMatchAll = async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleClassroomProvider();
      const existingAssignments = await repo.getAssignments(session.classId);
      let totalImported = 0;
      const matchedNames: string[] = [];

      for (const subject of subjects) {
        if (!subject.classroomCode) continue;
        try {
          const res = await provider.syncCourseworkForSubject(subject, async (item) => {
            // Check if assignment with identical title already exists
            const alreadyExists = existingAssignments.some(
              (a) => a.subjectId === subject.id && a.title.trim().toLowerCase() === item.title.trim().toLowerCase()
            );
            if (!alreadyExists) {
              await repo.createAssignment(
                session.classId,
                {
                  title: item.title,
                  subjectId: subject.id,
                  dueDate: item.dueDate,
                  notes: item.notes || `Imported from Google Classroom (${item.courseName})`,
                },
                session.displayName,
                session.email
              );
              totalImported++;
            }
          });
          matchedNames.push(`${subject.name} (${res.courseName}): ${res.count} items`);
        } catch {
          // Skip courses without matches
        }
      }

      if (totalImported > 0 || matchedNames.length > 0) {
        setSuccessMessage(`Auto-matched and imported ${totalImported} assignment(s) across matched subjects!`);
        if (onImportComplete) onImportComplete();
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setError('No courses matched your subjects’ Google Classroom codes.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Auto-match import failed');
    } finally {
      setIsLoading(false);
    }
  };

  // If already authorized in this browser session, auto-load courses on open
  useEffect(() => {
    if (isOpen && isConfigured) {
      const provider = new GoogleClassroomProvider();
      if (provider.hasToken() && courses.length === 0) {
        handleConnectGoogle();
      }
    }
  }, [isOpen, isConfigured, courses.length, handleConnectGoogle]);

  if (!isOpen) return null;

  const handleCourseChange = async (courseId: string) => {
    await loadCourseAssignments(courseId, courses);
  };

  const handleSignOutGoogle = () => {
    const provider = new GoogleClassroomProvider();
    provider.clearToken();
    setCourses([]);
    setSelectedCourseId('');
    setCoursework([]);
    setSelectedAssignmentIndices(new Set());
    setError(null);
  };

  const toggleSelectAssignment = (index: number) => {
    setSelectedAssignmentIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleImportAssignments = async () => {
    // Resolve targetSubjectId with fallback to the first available subject
    const resolvedSubjectId = targetSubjectId || (subjects.length > 0 ? subjects[0].id : '');

    if (!session) {
      setError('You must be joined into a class to import assignments.');
      return;
    }

    if (!resolvedSubjectId) {
      setError('Please select a target subject to assign coursework to.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let importedCount = 0;

      if (activeTab === 'google-api') {
        const toImport = coursework.filter((_, i) => selectedAssignmentIndices.has(i));
        for (const item of toImport) {
          await repo.createAssignment(
            session.classId,
            {
              title: item.title,
              subjectId: resolvedSubjectId,
              dueDate: item.dueDate,
              notes: item.notes || `Imported from Google Classroom`,
            },
            session.displayName,
            session.email
          );
          importedCount++;
        }
      } else {
        // Parse quick pasted text (one title per line)
        const lines = pastedText
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);

        for (const line of lines) {
          await repo.createAssignment(
            session.classId,
            {
              title: line,
              subjectId: resolvedSubjectId,
              dueDate: null,
              notes: `Imported via Google Classroom Quick Add`,
            },
            session.displayName,
            session.email
          );
          importedCount++;
        }
      }

      setSuccessMessage(`Successfully imported ${importedCount} assignment(s) to the board!`);
      if (onImportComplete) onImportComplete();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to import assignments');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="classroom-import-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <DownloadCloud className="h-5 w-5 text-primary" />
            <h2 id="classroom-import-title" className="text-lg font-bold text-foreground">
              Import from Google Classroom
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-4 flex border-b border-border text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('google-api')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2 font-medium transition ${
              activeTab === 'google-api'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>Google API</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quick-paste')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2 font-medium transition ${
              activeTab === 'quick-paste'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Quick Paste Titles</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
            {isConfigured && (
              <button
                type="button"
                onClick={() => handleConnectGoogle(true)}
                disabled={isLoading}
                className="shrink-0 inline-flex min-h-[32px] items-center px-2.5 py-1 text-xs font-semibold text-red-900 bg-red-100 hover:bg-red-200 rounded transition"
              >
                Sign In Again
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-4 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Target Subject Selector */}
        <div className="mt-4">
          <label htmlFor="import-target-subject" className="block text-sm font-medium text-foreground mb-1">
            Assign Coursework to Subject *
          </label>
          <select
            id="import-target-subject"
            value={targetSubjectId}
            onChange={(e) => {
              setTargetSubjectId(e.target.value);
              if (error) setError(null);
            }}
            className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {subjects.length === 0 ? (
              <option value="">No subjects found in class</option>
            ) : (
              subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.teacherName}){sub.classroomCode ? ` — [${sub.classroomCode}]` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Tab 1: Google API */}
        {activeTab === 'google-api' && (
          <div className="mt-4 space-y-4">
            {!isConfigured ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <KeyRound className="h-4 w-4 text-amber-600" />
                  <span>Google Client ID Not Set in .env</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  To connect live to Google Classroom, configure your OAuth Client ID in{' '}
                  <code className="bg-background px-1 py-0.5 rounded text-[11px] font-mono">.env</code>:
                </p>
                <pre className="rounded bg-background p-2 text-xs font-mono text-foreground overflow-x-auto border border-border">
                  VITE_FEATURE_CLASSROOM_IMPORT=true{'\n'}
                  VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
                </pre>
                <p className="text-[11px] text-muted-foreground">
                  In the meantime, you can use the <strong>Quick Paste Titles</strong> tab above to import exact titles
                  instantly!
                </p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground">Connect Your Google Account</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Sign in once to authorize Google Classroom and load your active courses and assignments.
                </p>
                <button
                  type="button"
                  onClick={() => handleConnectGoogle(true)}
                  disabled={isLoading}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
                >
                  <DownloadCloud className="h-4 w-4" />
                  <span>{isLoading ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1-Click Auto Match & Sync banner */}
                <div className="rounded-md border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Auto-Match by Classroom Code</span>
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      Automatically maps courses with matching codes and imports coursework into your subjects.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoMatchAll}
                    disabled={isLoading}
                    className="shrink-0 inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
                  >
                    <DownloadCloud className="h-3.5 w-3.5" />
                    <span>Auto-Import All</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <label htmlFor="select-google-course" className="block text-sm font-medium text-foreground mb-1">
                      Select Classroom Course
                    </label>
                    <select
                      id="select-google-course"
                      value={selectedCourseId}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      disabled={isLoading}
                      className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.enrollmentCode ? `(${c.enrollmentCode})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOutGoogle}
                    className="mt-6 flex min-h-[44px] items-center gap-1 text-xs text-muted-foreground hover:text-destructive px-2"
                    title="Sign out of Google"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Switch</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground mb-1">
                    <span>Coursework from Classroom ({coursework.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedAssignmentIndices.size === coursework.length) {
                          setSelectedAssignmentIndices(new Set());
                        } else {
                          setSelectedAssignmentIndices(new Set(coursework.map((_, i) => i)));
                        }
                      }}
                      className="text-primary hover:underline"
                    >
                      {selectedAssignmentIndices.size === coursework.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {coursework.length === 0 ? (
                    <p className="text-xs italic text-muted-foreground p-3 border rounded text-center">
                      No assignments found in this Google Classroom course.
                    </p>
                  ) : (
                    <ul className="max-h-48 overflow-y-auto space-y-1.5 border rounded-md p-2">
                      {coursework.map((item, idx) => {
                        const isChecked = selectedAssignmentIndices.has(idx);
                        return (
                          <li
                            key={idx}
                            onClick={() => toggleSelectAssignment(idx)}
                            className={`flex items-start gap-2.5 p-2 rounded cursor-pointer text-xs transition border ${
                              isChecked ? 'bg-secondary/60 border-primary/40' : 'bg-background border-border'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectAssignment(idx)}
                              className="mt-0.5 rounded text-primary focus:ring-primary"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate">{item.title}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {item.dueDate ? (
                                  <span>Due: {item.dueDate}</span>
                                ) : (
                                  <span className="text-amber-700 font-medium flex items-center gap-1">
                                    <HelpCircle className="h-3 w-3 inline" /> No due date in Classroom
                                  </span>
                                )}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Quick Paste */}
        {activeTab === 'quick-paste' && (
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="quick-paste-textarea" className="block text-sm font-medium text-foreground mb-1">
                Paste Assignment Titles (one per line)
              </label>
              <textarea
                id="quick-paste-textarea"
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={
                  'Tugas 1: ERD & Perancangan Basis Data\nTugas 2: Implementasi CRUD MySQL\nProyek Akhir Web App'
                }
                className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Each line will become an assignment on your board with missing due date flagged for classmates to
                complete.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="min-h-[44px] rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>

          {((activeTab === 'google-api' && coursework.length > 0) ||
            (activeTab === 'quick-paste' && pastedText.trim().length > 0)) && (
            <button
              type="button"
              onClick={handleImportAssignments}
              disabled={isLoading || (activeTab === 'google-api' && selectedAssignmentIndices.size === 0)}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
            >
              <DownloadCloud className="h-4 w-4" />
              <span>{isLoading ? 'Importing...' : 'Import to Board'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
