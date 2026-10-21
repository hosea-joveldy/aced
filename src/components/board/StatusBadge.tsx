import { AlertCircle, HelpCircle, Calendar, CheckCircle2, Clock, CalendarDays } from 'lucide-react';
import type { DeadlineGroup } from '@/lib/date';

interface StatusBadgeProps {
  group: DeadlineGroup;
  dueDate?: string | null;
}

export function StatusBadge({ group, dueDate }: StatusBadgeProps) {
  switch (group) {
    case 'overdue':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100/90 px-3 py-0.5 text-xs font-semibold text-red-800">
          <AlertCircle className="h-3 w-3 shrink-0 text-red-700" />
          <span>Overdue{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'needs-date':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-100/90 px-3 py-0.5 text-xs font-semibold text-amber-900">
          <HelpCircle className="h-3 w-3 shrink-0 text-amber-700" />
          <span>Needs date</span>
        </span>
      );
    case 'today':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/90 px-3 py-0.5 text-xs font-semibold text-emerald-900">
          <Calendar className="h-3 w-3 shrink-0 text-emerald-700" />
          <span>Due today</span>
        </span>
      );
    case 'this-week':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5D4CC] bg-[#EFEFE9] px-3 py-0.5 text-xs font-medium text-[#4A4A46]">
          <Clock className="h-3 w-3 shrink-0 text-[#73726C]" />
          <span>This week{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'later':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E1DA] bg-[#F7F6F1] px-3 py-0.5 text-xs font-medium text-[#73726C]">
          <CalendarDays className="h-3 w-3 shrink-0 text-[#73726C]" />
          <span>Later{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'done':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E1DA] bg-[#F2F1EB] px-3 py-0.5 text-xs font-medium text-[#73726C]">
          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-700" />
          <span>Done</span>
        </span>
      );
  }
}
