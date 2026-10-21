import { useState, useEffect, useCallback } from 'react';
import type { Assignment, Subject } from '@/types';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
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

  const loadData = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const [subList, asgList] = await Promise.all([
        repo.getSubjects(session.classId),
        repo.getAssignments(session.classId),
      ]);
      setSubjects(subList);
      setAssignments(asgList);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load subjects';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [repo, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleSaveSubject = async (data: {
    name: string;
    teacherName: string;
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

    const latestAssignments = await repo.getAssignments(session.classId);
    setAssignments(latestAssignments);
  };

  const handleSaveAssignment = async (data: {
    title: string;
    subjectId: string;
    dueDate: string | null;
    notes?: string | null;
  }) => {
    if (!session) return;

    if (selectedAssignment) {
      const updated = await repo.updateAssignment(
        selectedAssignment.id,
        data,
        session.displayName,
        session.email
      );
      setAssignments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } else {
      const created = await repo.createAssignment(
        session.classId,
        data,
        session.displayName,
        session.email
      );
      setAssignments((prev) => [created, ...prev]);
    }
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
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[#141413]">
            Class Subjects
          </h2>
          <p className="text-xs sm:text-sm text-[#73726C] mt-1">
            {subjects.length} course{subjects.length === 1 ? '' : 's'} registered in {session?.className}
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#141413] px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-black transition cursor-pointer shadow-sm"
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
              className="h-48 rounded-3xl border border-[#E2E1DA] bg-white/60 animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-sm font-semibold text-red-900">
            Failed to Load Subjects
          </h3>
          <p className="text-xs text-red-800 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="mt-4 flex min-h-[36px] items-center gap-2 rounded-full border border-red-300 bg-white px-4 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-100 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && subjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D5D4CC] bg-white p-12 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEFE9] text-[#141413] mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-[#141413]">
            No Subjects Added Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#73726C] mt-1 max-w-sm mb-5">
            Start by adding the subjects and teachers for your class cohort.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex min-h-[44px] items-center gap-2 rounded-full bg-[#141413] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-black transition cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Subject</span>
          </button>
        </div>
      )}

      {/* 3-column desktop grid */}
      {!isLoading && !error && subjects.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              assignments={assignments.filter((a) => a.subjectId === subject.id)}
              onEdit={handleOpenEdit}
              onDelete={setSubjectToDelete}
              onAssignDeadline={handleOpenAssignDeadline}
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

      {/* Delete Subject Confirmation Dialog */}
      {subjectToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-subject-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-3xl border border-[#E2E1DA] bg-[#FAF9F5] p-6 shadow-2xl animate-in fade-in-0 zoom-in-95">
            <h3 id="delete-subject-title" className="text-lg font-serif font-semibold text-[#141413]">
              Delete Subject?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#52524E] leading-relaxed">
              Are you sure you want to delete <strong>{subjectToDelete.name}</strong>?
              All associated assignments will also be permanently removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                disabled={isDeleting}
                className="min-h-[40px] rounded-full border border-[#DCDAD2] bg-white px-5 py-2 text-xs font-medium text-[#4A4A46] hover:bg-[#EFEFEA] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="min-h-[40px] rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition cursor-pointer shadow-sm"
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
