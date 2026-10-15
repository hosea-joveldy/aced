import type { Assignment, Subject } from '@/types';
import type { DeadlineGroup } from '@/lib/date';
import { AssignmentCard } from './AssignmentCard';
import { AlertCircle, HelpCircle, Calendar, CheckCircle2, Clock, CalendarDays } from 'lucide-react';

interface BoardGroupProps {
  groupId: DeadlineGroup;
  title: string;
  assignments: Assignment[];
  subjectsMap: Map<string, Subject>;
  onToggleComplete: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
}

export function BoardGroup({
  groupId,
  title,
  assignments,
  subjectsMap,
  onToggleComplete,
  onEdit,
}: BoardGroupProps) {
  if (assignments.length === 0) return null;

  const getHeaderIcon = () => {
    switch (groupId) {
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'needs-date':
        return <HelpCircle className="h-4 w-4 text-amber-400" />;
      case 'today':
        return <Calendar className="h-4 w-4 text-blue-400" />;
      case 'this-week':
        return <Clock className="h-4 w-4 text-zinc-400" />;
      case 'later':
        return <CalendarDays className="h-4 w-4 text-zinc-500" />;
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <section className="space-y-3" aria-labelledby={`group-title-${groupId}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          {getHeaderIcon()}
          <h3
            id={`group-title-${groupId}`}
            className="text-sm sm:text-base font-semibold text-zinc-200"
          >
            {title}
          </h3>
          <span className="rounded-full bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 text-xs font-mono text-zinc-300">
            {assignments.length}
          </span>
        </div>

        {/* Needs a date crowdsource note */}
        {groupId === 'needs-date' && (
          <span className="text-xs font-medium text-amber-400/90 bg-amber-950/30 border border-amber-900/40 rounded-full px-2.5 py-0.5">
            Help your class – add the date
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            subject={subjectsMap.get(assignment.subjectId)}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
}
