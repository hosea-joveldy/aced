import type { Assignment, Subject } from '@/types';
import { StatusBadge } from './StatusBadge';
import { getDeadlineGroup } from '@/lib/date';
import { Pencil, Check } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  subject?: Subject;
  onToggleComplete: (assignment: Assignment) => void;
  onEdit?: (assignment: Assignment) => void;
}

export function AssignmentCard({
  assignment,
  subject,
  onToggleComplete,
  onEdit,
}: AssignmentCardProps) {
  const group = getDeadlineGroup(assignment.dueDate, assignment.completed);

  return (
    <div
      className={`group flex items-start gap-3.5 rounded-xl border p-3.5 sm:p-4 transition ${
        assignment.completed
          ? 'border-zinc-800/50 bg-zinc-950/40 opacity-70'
          : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700'
      }`}
    >
      {/* 44px+ touch target checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={assignment.completed}
        aria-label={`Mark "${assignment.title}" as ${
          assignment.completed ? 'incomplete' : 'complete'
        }`}
        onClick={() => onToggleComplete(assignment)}
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center -ml-2 -mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
            assignment.completed
              ? 'border-emerald-500 bg-emerald-500 text-zinc-950'
              : 'border-zinc-700 bg-zinc-950 hover:border-zinc-400'
          }`}
        >
          {assignment.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </span>
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {subject && (
            <span className="inline-block rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-xs font-medium text-zinc-400">
              {subject.name}
            </span>
          )}
          <StatusBadge group={group} dueDate={assignment.dueDate} />
        </div>

        <h4
          className={`text-sm sm:text-base font-medium leading-snug break-words ${
            assignment.completed
              ? 'text-zinc-500 line-through'
              : 'text-zinc-100'
          }`}
        >
          {assignment.title}
        </h4>

        {assignment.notes && (
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 line-clamp-2 break-words">
            {assignment.notes}
          </p>
        )}
      </div>

      {/* Edit button */}
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(assignment)}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 hover:border-zinc-700 transition -mr-2 -mt-2 cursor-pointer shadow-sm"
          title={`Edit ${assignment.title}`}
          aria-label={`Edit ${assignment.title}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
