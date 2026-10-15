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
      {/* Top Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
            Class Subjects
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {subjects.length} course{subjects.length === 1 ? '' : 's'} registered in {session?.className}
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition cursor-pointer shadow-sm"
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
              className="h-48 rounded-xl border border-zinc-800/80 bg-zinc-900/30 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-xl border border-red-900/50 bg-red-950/40 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
          <h3 className="text-sm font-semibold text-red-200">
            Failed to Load Subjects
          </h3>
          <p className="text-xs text-red-300 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadSubjects}
            className="mt-4 flex min-h-[40px] items-center gap-2 rounded-lg border border-red-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-red-300 hover:bg-zinc-800 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {!isLoading && !error && subjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 mb-3">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            No Subjects Added Yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mb-4">
            Add your subjects with teacher names and Google Classroom codes so classmates can post assignments.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex min-h-[40px] items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Subject</span>
          </button>
        </div>
      )}

      {/* 3-column desktop grid */}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 id="delete-subject-title" className="text-base font-semibold text-zinc-100">
              Delete Subject?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Are you sure you want to delete <span className="font-semibold text-zinc-200">{subjectToDelete.name}</span>? All assignments linked to this subject will also be deleted.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                disabled={isDeleting}
                className="min-h-[40px] rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="min-h-[40px] rounded-lg bg-red-950/80 border border-red-800/80 px-4 py-2 text-xs font-semibold text-red-200 hover:bg-red-900 disabled:opacity-50 cursor-pointer shadow-sm"
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
