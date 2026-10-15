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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-900/50 bg-red-950/40 px-2.5 py-0.5 text-xs font-medium text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0 text-red-400" />
          <span>Overdue{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'needs-date':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/50 bg-amber-950/40 px-2.5 py-0.5 text-xs font-medium text-amber-400">
          <HelpCircle className="h-3 w-3 shrink-0 text-amber-400" />
          <span>Needs date</span>
        </span>
      );
    case 'today':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-900/50 bg-blue-950/40 px-2.5 py-0.5 text-xs font-medium text-blue-400">
          <Calendar className="h-3 w-3 shrink-0 text-blue-400" />
          <span>Due today</span>
        </span>
      );
    case 'this-week':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
          <Clock className="h-3 w-3 shrink-0 text-zinc-400" />
          <span>This week{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'later':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
          <CalendarDays className="h-3 w-3 shrink-0 text-zinc-500" />
          <span>Later{dueDate ? ` (${dueDate})` : ''}</span>
        </span>
      );
    case 'done':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/50 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" />
          <span>Done</span>
        </span>
      );
  }
}
