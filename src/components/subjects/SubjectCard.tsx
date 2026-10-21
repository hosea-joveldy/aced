import type { Assignment, Subject } from '@/types';
import { User, Pencil, CalendarPlus, Calendar, CheckCircle2, HelpCircle, Trash2 } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  assignments?: Assignment[];
  onEdit: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
  onAssignDeadline?: (assignment: Assignment) => void;
}

export function SubjectCard({
  subject,
  assignments = [],
  onEdit,
  onDelete,
  onAssignDeadline,
}: SubjectCardProps) {
  const activeAssignments = assignments.filter((a) => !a.completed);
  const missingDateAssignments = assignments.filter((a) => !a.completed && !a.dueDate);

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (!a.dueDate && b.dueDate) return -1;
    if (a.dueDate && !b.dueDate) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E2E1DA] bg-[#F7F6F1] hover:border-[#D5D4CC] transition-all shadow-sm">
      {/* Header bar */}
      <div className="border-b border-[#E8E7E0] bg-[#FAF9F5] p-5 flex items-center justify-between">
        <div className="min-w-0 pr-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#73726C]">
            Course Subject
          </span>
          <h3 className="truncate text-lg font-serif font-semibold text-[#141413]">
            {subject.name}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[#EFEFE9] border border-[#E2E1DA] rounded-full p-1">
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full text-xs text-[#52524E] hover:text-[#141413] hover:bg-white transition cursor-pointer"
            title={`Edit ${subject.name}`}
            aria-label={`Edit ${subject.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(subject)}
              className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full text-xs text-[#52524E] hover:text-red-700 hover:bg-white transition cursor-pointer"
              title={`Delete ${subject.name}`}
              aria-label={`Delete ${subject.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Teacher name */}
        <div className="flex items-center gap-2 text-sm text-[#52524E]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFEFE9] text-[#141413]">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="font-medium text-[#141413]">{subject.teacherName}</span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-xs border border-[#E8E7E0]">
          <span className="font-medium text-[#52524E]">
            {activeAssignments.length} active · {missingDateAssignments.length} missing date
          </span>
          {missingDateAssignments.length > 0 && onAssignDeadline && (
            <button
              type="button"
              onClick={() => onAssignDeadline(missingDateAssignments[0])}
              className="inline-flex min-h-[28px] items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-200 transition cursor-pointer"
            >
              Add date
            </button>
          )}
        </div>

        {/* Assignments list */}
        <div
          className="space-y-2 rounded-2xl bg-white p-3 border border-[#E8E7E0]"
          data-testid={`classroom-assignments-${subject.id}`}
        >
          <div className="flex items-center justify-between text-xs text-[#141413] font-semibold">
            <span>Subject Assignments ({sortedAssignments.length})</span>
          </div>

          {sortedAssignments.length === 0 ? (
            <p className="text-xs italic text-[#73726C] py-2 text-center">
              No assignments posted for this subject yet.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {sortedAssignments.slice(0, 3).map((asg) => (
                <li
                  key={asg.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#ECEBE4] bg-[#FAF9F5] px-3 py-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-medium ${
                        asg.completed
                          ? 'line-through text-[#73726C]'
                          : 'text-[#141413]'
                      }`}
                    >
                      {asg.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {asg.completed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Done {asg.dueDate ? `(${asg.dueDate})` : ''}
                        </span>
                      ) : asg.dueDate ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#52524E]">
                          <Calendar className="h-3 w-3 text-[#73726C]" />
                          Due {asg.dueDate}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                          <HelpCircle className="h-3 w-3 text-amber-700" />
                          No deadline set
                        </span>
                      )}
                    </div>
                  </div>

                  {onAssignDeadline && (
                    <button
                      type="button"
                      onClick={() => onAssignDeadline(asg)}
                      aria-label={`Assign deadline for ${asg.title}`}
                      className={`shrink-0 inline-flex min-h-[28px] items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                        !asg.dueDate
                          ? 'bg-[#141413] text-white hover:bg-black'
                          : 'border border-[#DCDAD2] bg-white text-[#52524E] hover:bg-[#EFEFEA]'
                      }`}
                    >
                      <CalendarPlus className="h-3 w-3" />
                      <span>{!asg.dueDate ? 'Assign Date' : 'Set Date'}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
