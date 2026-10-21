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
        return <AlertCircle className="h-4 w-4 text-red-700" />;
      case 'needs-date':
        return <HelpCircle className="h-4 w-4 text-amber-700" />;
      case 'today':
        return <Calendar className="h-4 w-4 text-emerald-700" />;
      case 'this-week':
        return <Clock className="h-4 w-4 text-[#73726C]" />;
      case 'later':
        return <CalendarDays className="h-4 w-4 text-[#73726C]" />;
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-emerald-700" />;
    }
  };

  return (
    <section className="space-y-3" aria-labelledby={`group-title-${groupId}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E7E0] pb-3">
        <div className="flex items-center gap-2">
          {getHeaderIcon()}
          <h3
            id={`group-title-${groupId}`}
            className="text-base font-serif font-semibold text-[#141413]"
          >
            {title}
          </h3>
          <span className="rounded-full bg-[#EFEFE9] border border-[#D5D4CC] px-2.5 py-0.5 text-xs font-mono font-semibold text-[#141413]">
            {assignments.length}
          </span>
        </div>

        {/* Needs a date crowdsource note */}
        {groupId === 'needs-date' && (
          <span className="text-xs font-semibold text-amber-900 bg-amber-100 border border-amber-200 rounded-full px-3 py-0.5">
            Help your class – add the date
          </span>
        )}
      </div>

      <div className="space-y-3">
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
