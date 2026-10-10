import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Assignment, Subject } from '@/types';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
import { getToday, getDeadlineGroup } from '@/lib/date';
import { MetricsStrip } from '@/components/board/MetricsStrip';
import { SubjectFilter } from '@/components/board/SubjectFilter';
import { BoardGroup } from '@/components/board/BoardGroup';
import { AssignmentModal } from '@/components/board/AssignmentModal';
import { ClassroomImportButton } from '@/components/classroom/ClassroomImportButton';
import { CalendarDays, AlertCircle, RotateCcw, Plus } from 'lucide-react';

export function BoardScreen() {
  const repo = useRepository();
  const { session } = useSession();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const loadData = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const [asgList, subList] = await Promise.all([
        repo.getAssignments(session.classId),
        repo.getSubjects(session.classId),
      ]);
      setAssignments(asgList);
      setSubjects(subList);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load assignments';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [repo, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const subjectsMap = useMemo(() => {
    const map = new Map<string, Subject>();
    for (const sub of subjects) {
      map.set(sub.id, sub);
    }
    return map;
  }, [subjects]);

  const handleOpenAdd = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
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

  const handleToggleComplete = async (assignment: Assignment) => {
    if (!session) return;
    const nextCompleted = !assignment.completed;
    try {
      const updated = await repo.toggleAssignmentComplete(
        assignment.id,
        nextCompleted,
        session.displayName,
        session.email
      );
      setAssignments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

  // Metrics
  const today = getToday();
  const metrics = useMemo(() => {
    let overdue = 0;
    let dueToday = 0;
    let needsDate = 0;

    for (const asg of assignments) {
      if (asg.completed) continue;
      if (!asg.dueDate) {
        needsDate++;
      } else if (asg.dueDate < today) {
        overdue++;
      } else if (asg.dueDate === today) {
        dueToday++;
      }
    }

    return { overdue, dueToday, needsDate };
  }, [assignments, today]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    if (!selectedSubjectId) return assignments;
    return assignments.filter((a) => a.subjectId === selectedSubjectId);
  }, [assignments, selectedSubjectId]);

  // Grouped assignments
  const grouped = useMemo(() => {
    const groups = {
      'needs-date': [] as Assignment[],
      overdue: [] as Assignment[],
      today: [] as Assignment[],
      'this-week': [] as Assignment[],
      later: [] as Assignment[],
      done: [] as Assignment[],
    };

    for (const asg of filteredAssignments) {
      const g = getDeadlineGroup(asg.dueDate, asg.completed, today);
      groups[g].push(asg);
    }

    return groups;
  }, [filteredAssignments, today]);

  const selectedSubject = selectedSubjectId
    ? subjectsMap.get(selectedSubjectId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Assignments & Deadlines
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Crowdsourced by students in {session?.className}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ClassroomImportButton />
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <MetricsStrip
        overdueCount={metrics.overdue}
        todayCount={metrics.dueToday}
        needsDateCount={metrics.needsDate}
      />

      {/* Subject Filter Bar */}
      {subjects.length > 0 && (
        <SubjectFilter
          subjects={subjects}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={setSelectedSubjectId}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div role="status" aria-busy="true" className="space-y-4">
          <span className="sr-only">Loading assignments...</span>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-lg border border-border bg-muted/40 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-base font-bold text-red-900">
            Failed to Load Assignments
          </h3>
          <p className="text-sm text-red-700 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="mt-4 flex min-h-[44px] items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Empty State when filter matches nothing */}
      {!isLoading && !error && filteredAssignments.length === 0 && selectedSubject && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-3">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No assignments for {selectedSubject.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-4">
            No deadlines currently posted for this subject.
          </p>
          <button
            type="button"
            onClick={() => setSelectedSubjectId(null)}
            className="flex min-h-[44px] items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted shadow-sm"
          >
            <span>Show All Subjects</span>
          </button>
        </div>
      )}

      {/* Empty State when zero total assignments */}
      {!isLoading && !error && assignments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-3">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Deadlines Posted Yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-4">
            Be the first in your class to add an upcoming assignment or homework!
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Assignment</span>
          </button>
        </div>
      )}

      {/* Grouped Board View */}
      {!isLoading && !error && filteredAssignments.length > 0 && (
        <div className="space-y-6">
          <BoardGroup
            groupId="needs-date"
            title="Needs a date"
            assignments={grouped['needs-date']}
            subjectsMap={subjectsMap}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
          />

          <BoardGroup
            groupId="overdue"
            title="Overdue"
            assignments={grouped.overdue}
            subjectsMap={subjectsMap}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
          />

          <BoardGroup
            groupId="today"
            title="Due today"
            assignments={grouped.today}
            subjectsMap={subjectsMap}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
          />

          <BoardGroup
            groupId="this-week"
            title="This week"
            assignments={grouped['this-week']}
            subjectsMap={subjectsMap}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
          />

          <BoardGroup
            groupId="later"
            title="Later"
            assignments={grouped.later}
            subjectsMap={subjectsMap}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
          />

          <BoardGroup
            groupId="done"
            title="Done"
            assignments={grouped.done}
            subjectsMap={subjectsMap}
            onToggleComplete={handleToggleComplete}
            onEdit={handleOpenEdit}
          />
        </div>
      )}

      {/* Assignment Create / Edit Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignment={selectedAssignment}
        subjects={subjects}
        onSave={handleSaveAssignment}
      />
    </div>
  );
}
