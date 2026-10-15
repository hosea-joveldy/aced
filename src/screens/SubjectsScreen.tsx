import { useState, useEffect, useCallback } from 'react';
import type { Assignment, Subject } from '@/types';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
import { classroomImportEnabled } from '@/lib/env';
import { GoogleClassroomProvider } from '@/lib/classroom';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { SubjectModal } from '@/components/subjects/SubjectModal';
import { AssignmentModal } from '@/components/board/AssignmentModal';
import { Plus, BookOpen, AlertCircle, RotateCcw } from 'lucide-react';

export function SubjectsScreen() {
  const repo = useRepository();
  const { session } = useSession();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const loadSubjects = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const [subData, asgData] = await Promise.all([
        repo.getSubjects(session.classId),
        repo.getAssignments(session.classId),
      ]);
      setSubjects(subData);
      setAssignments(asgData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load subjects';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [repo, session]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleOpenAdd = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleOpenAssignDeadline = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  const handleSyncClassroom = async (subject: Subject) => {
    if (!session) return;
    try {
      const provider = new GoogleClassroomProvider();
      await provider.requestAccessToken();
      const existing = await repo.getAssignments(session.classId);
      await provider.syncCourseworkForSubject(subject, async (item) => {
        const alreadyExists = existing.some(
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
        }
      });
      const latest = await repo.getAssignments(session.classId);
      setAssignments(latest);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Classroom sync failed');
    }
  };

  const handleSaveSubject = async (data: {
    name: string;
    teacherName: string;
    classroomCode?: string | null;
  }) => {
    if (!session) return;

    let savedSubject: Subject;
    if (selectedSubject) {
      savedSubject = await repo.updateSubject(selectedSubject.id, data);
      setSubjects((prev) =>
        prev.map((s) => (s.id === savedSubject.id ? savedSubject : s))
      );
    } else {
      savedSubject = await repo.createSubject(session.classId, data);
      setSubjects((prev) => [...prev, savedSubject]);
    }

    if (data.classroomCode && classroomImportEnabled()) {
      try {
        const provider = new GoogleClassroomProvider();
        if (provider.hasToken()) {
          const existing = await repo.getAssignments(session.classId);
          await provider.syncCourseworkForSubject(savedSubject, async (item) => {
            const alreadyExists = existing.some(
              (a) => a.subjectId === savedSubject.id && a.title.trim().toLowerCase() === item.title.trim().toLowerCase()
            );
            if (!alreadyExists) {
              await repo.createAssignment(
                session.classId,
                {
                  title: item.title,
                  subjectId: savedSubject.id,
                  dueDate: item.dueDate,
                  notes: item.notes || `Imported from Google Classroom (${item.courseName})`,
                },
                session.displayName,
                session.email
              );
            }
          });
        }
      } catch {
        // Fallback
      }
    }

    const latestAssignments = await repo.getAssignments(session.classId);
    setAssignments(latestAssignments);
  };

  const handleSaveAssignment = async (data: {
    title: string;
    subjectId: string;
    dueDate: string | null;
    notes?: string | null;
  }) => {
    if (!session || !selectedAssignment) return;

    const updated = await repo.updateAssignment(
      selectedAssignment.id,
      data,
      session.displayName,
      session.email
    );
    setAssignments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!session || !subjectToDelete) return;
    setIsDeleting(true);
    try {
      await repo.deleteSubject(subjectToDelete.id);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectToDelete.id));
      setAssignments((prev) => prev.filter((a) => a.subjectId !== subjectToDelete.id));
      setSubjectToDelete(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete subject');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row matching wireframe Frame 3 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Class Subjects
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {subjects.length} course{subjects.length === 1 ? '' : 's'} registered in {session?.className}
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {isLoading && (
        <div
          role="status"
          aria-busy="true"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <span className="sr-only">Loading subjects...</span>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-border bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-base font-bold text-red-900">
            Failed to Load Subjects
          </h3>
          <p className="text-sm text-red-700 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadSubjects}
            className="mt-4 flex min-h-[44px] items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {!isLoading && !error && subjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Subjects Added Yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-4">
            Add your subjects with teacher names and Google Classroom codes so classmates can post assignments.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Subject</span>
          </button>
        </div>
      )}

      {/* 3-column desktop grid matching wireframe Frame 3 (grid3) */}
      {!isLoading && !error && subjects.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              assignments={assignments.filter((a) => a.subjectId === subject.id)}
              onEdit={handleOpenEdit}
              onDelete={setSubjectToDelete}
              onAssignDeadline={handleOpenAssignDeadline}
              onSyncClassroom={classroomImportEnabled() ? handleSyncClassroom : undefined}
            />
          ))}
        </div>
      )}

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subject={selectedSubject}
        onSave={handleSaveSubject}
        onDelete={setSubjectToDelete}
      />

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        assignment={selectedAssignment}
        subjects={subjects}
        onSave={handleSaveAssignment}
      />

      {subjectToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-subject-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 id="delete-subject-title" className="text-lg font-bold text-foreground">
              Delete Subject?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">{subjectToDelete.name}</span>? All assignments linked to this subject will also be deleted.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                disabled={isDeleting}
                className="min-h-[44px] rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="min-h-[44px] rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Delete Subject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
