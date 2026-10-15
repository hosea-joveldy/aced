import { AlertCircle, Calendar, HelpCircle } from 'lucide-react';

interface MetricsStripProps {
  overdueCount: number;
  todayCount: number;
  needsDateCount: number;
}

export function MetricsStrip({
  overdueCount,
  todayCount,
  needsDateCount,
}: MetricsStripProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4" aria-label="Deadline summary metrics">
      {/* Overdue Tile - Apple Reminders Style */}
      <div className="flex flex-col justify-between rounded-xl border border-red-200/80 bg-red-50/60 p-3.5 sm:p-4 shadow-sm hover:border-red-300 transition">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700">
            <AlertCircle className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-red-900">
            {overdueCount}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-xs font-bold text-red-800 tracking-wide uppercase">
            Overdue
          </span>
        </div>
      </div>

      {/* Due Today Tile */}
      <div className="flex flex-col justify-between rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-3.5 sm:p-4 shadow-sm hover:border-indigo-300 transition">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-900">
            {todayCount}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-xs font-bold text-indigo-800 tracking-wide uppercase">
            Due Today
          </span>
        </div>
      </div>

      {/* Needs Date Tile */}
      <div className="flex flex-col justify-between rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5 sm:p-4 shadow-sm hover:border-amber-300 transition">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-950">
            {needsDateCount}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-xs font-bold text-amber-800 tracking-wide uppercase">
            Needs Date
          </span>
        </div>
      </div>
    </div>
  );
}
