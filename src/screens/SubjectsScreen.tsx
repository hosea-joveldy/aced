import { useState, useEffect, useCallback } from 'react';
import type { Subject } from '@/types';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { SubjectModal } from '@/components/subjects/SubjectModal';
import { Plus, BookOpen, AlertCircle, RotateCcw } from 'lucide-react';

export function SubjectsScreen() {
  const repo = useRepository();
  const { session } = useSession();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const loadSubjects = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await repo.getSubjects(session.classId);
      setSubjects(data);
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

  const handleSaveSubject = async (data: {
    name: string;
    teacherName: string;
    classroomCode?: string | null;
  }) => {
    if (!session) return;

    if (selectedSubject) {
      const updated = await repo.updateSubject(selectedSubject.id, data);
      setSubjects((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } else {
      const created = await repo.createSubject(session.classId, data);
      setSubjects((prev) => [...prev, created]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Class Subjects
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {subjects.length} course{subjects.length === 1 ? '' : 's'} registered in {session?.className}
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {isLoading && (
        <div
          role="status"
          aria-busy="true"
          className="grid gap-4 sm:grid-cols-2"
        >
          <span className="sr-only">Loading subjects...</span>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-36 rounded-lg border border-border bg-muted/40 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-base font-bold text-red-900">
            Failed to Load Subjects
          </h3>
          <p className="text-sm text-red-700 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadSubjects}
            className="mt-4 flex min-h-[44px] items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {!isLoading && !error && subjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
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
            className="flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Subject</span>
          </button>
        </div>
      )}

      {!isLoading && !error && subjects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subject={selectedSubject}
        onSave={handleSaveSubject}
      />
    </div>
  );
}
