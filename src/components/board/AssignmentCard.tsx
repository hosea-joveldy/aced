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
      className={`group flex items-start gap-3.5 rounded-3xl border p-4 sm:p-5 transition shadow-sm ${
        assignment.completed
          ? 'border-[#E8E7E0] bg-[#F7F6F1] opacity-65'
          : 'border-[#E2E1DA] bg-white hover:border-[#D5D4CC] hover:shadow-md'
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
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center -ml-2 -mt-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#141413] cursor-pointer"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
            assignment.completed
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-[#D5D4CC] bg-[#FAF9F5] hover:border-[#141413]'
          }`}
        >
          {assignment.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </span>
      </button>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {subject && (
            <span className="inline-block rounded-full border border-[#D5D4CC] bg-[#F2F1EB] px-3 py-0.5 text-xs font-semibold text-[#52524E]">
              {subject.name}
            </span>
          )}
          <StatusBadge group={group} dueDate={assignment.dueDate} />
        </div>

        <h4
          className={`text-sm sm:text-base font-semibold leading-snug break-words ${
            assignment.completed
              ? 'text-[#73726C] line-through'
              : 'text-[#141413]'
          }`}
        >
          {assignment.title}
        </h4>

        {assignment.notes && (
          <p className="mt-1 text-xs sm:text-sm text-[#52524E] line-clamp-2 break-words">
            {assignment.notes}
          </p>
        )}
      </div>

      {/* Edit button */}
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(assignment)}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-[#D5D4CC] bg-white p-2 text-xs font-medium text-[#52524E] hover:bg-[#F2F1EB] hover:text-[#141413] transition -mr-2 -mt-2 cursor-pointer shadow-sm"
          title={`Edit ${assignment.title}`}
          aria-label={`Edit ${assignment.title}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
