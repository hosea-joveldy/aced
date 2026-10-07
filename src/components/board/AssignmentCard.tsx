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
      className={`flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition ${
        assignment.completed
          ? 'border-border/60 bg-muted/20 opacity-80'
          : 'border-border hover:border-border/80'
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
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center -ml-2 -mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
            assignment.completed
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-input bg-background hover:border-primary'
          }`}
        >
          {assignment.completed && <Check className="h-4 w-4 stroke-[3]" />}
        </span>
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {subject && (
            <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
              {subject.name}
            </span>
          )}
          <StatusBadge group={group} dueDate={assignment.dueDate} />
        </div>

        <h3
          className={`text-base font-semibold leading-snug break-words ${
            assignment.completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground'
          }`}
        >
          {assignment.title}
        </h3>

        {assignment.notes && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 break-words">
            {assignment.notes}
          </p>
        )}
      </div>

      {/* Edit button */}
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(assignment)}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border border-input bg-background p-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition -mr-2 -mt-2"
          title={`Edit ${assignment.title}`}
          aria-label={`Edit ${assignment.title}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
