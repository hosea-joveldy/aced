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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
          <span>Overdue{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'needs-date':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>Needs date</span>
        </span>
      );
    case 'today':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
          <span>Due today</span>
        </span>
      );
    case 'this-week':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
          <Clock className="h-3.5 w-3.5 shrink-0 text-sky-600" />
          <span>This week{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'later':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span>Later{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'done':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span>Done</span>
        </span>
      );
  }
}
