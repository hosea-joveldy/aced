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
import { CalendarDays, AlertCircle, RotateCcw, Plus, Search, X } from 'lucide-react';

export function BoardScreen() {
  const repo = useRepository();
  const { session } = useSession();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filtered assignments (subject + search)
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      if (selectedSubjectId && a.subjectId !== selectedSubjectId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesNotes = a.notes ? a.notes.toLowerCase().includes(q) : false;
        return matchesTitle || matchesNotes;
      }
      return true;
    });
  }, [assignments, selectedSubjectId, searchQuery]);

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
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
            Assignments & Deadlines
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Crowdsourced by students in {session?.className}
          </p>
        </div>

        {/* Action Controls: Search & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Minimalist search input */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments..."
              className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900/60 pl-9 pr-8 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition shadow-inner"
              aria-label="Search assignments"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5 rounded cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <ClassroomImportButton subjects={subjects} onImportComplete={loadData} />

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <MetricsStrip
        overdueCount={metrics.overdue}
        todayCount={metrics.dueToday}
        needsDateCount={metrics.needsDate}
      />

      {/* Subject Filter Chips Bar */}
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
              className="h-24 rounded-xl border border-zinc-800/80 bg-zinc-900/30 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-xl border border-red-900/50 bg-red-950/40 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
          <h3 className="text-sm font-semibold text-red-200">
            Failed to Load Assignments
          </h3>
          <p className="text-xs text-red-300 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="mt-4 flex min-h-[40px] items-center gap-2 rounded-lg border border-red-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-red-300 hover:bg-zinc-800 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Empty State when Search Query matches nothing */}
      {!isLoading && !error && filteredAssignments.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 mb-3">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            No assignments match &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mb-4">
            Try checking for typos or searching a different term.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="flex min-h-[36px] items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
          >
            <span>Clear Search</span>
          </button>
        </div>
      )}

      {/* Empty State when Subject Filter matches nothing */}
      {!isLoading && !error && filteredAssignments.length === 0 && !searchQuery && selectedSubject && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 mb-3">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            No assignments for {selectedSubject.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mb-4">
            No deadlines currently posted for this subject.
          </p>
          <button
            type="button"
            onClick={() => setSelectedSubjectId(null)}
            className="flex min-h-[36px] items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
          >
            <span>Show All Subjects</span>
          </button>
        </div>
      )}

      {/* Empty State when zero total assignments */}
      {!isLoading && !error && assignments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 mb-3">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            No Deadlines Posted Yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mb-4">
            Be the first in your class to add an upcoming assignment or homework!
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex min-h-[40px] items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition cursor-pointer shadow-sm"
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
