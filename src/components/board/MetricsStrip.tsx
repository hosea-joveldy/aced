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
    <div className="grid grid-cols-3 gap-2.5 sm:gap-4" aria-label="Deadline summary metrics">
      {/* Overdue */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/70 p-3 text-center sm:flex-row sm:justify-start sm:gap-3 sm:p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 mb-1.5 sm:mb-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="sm:text-left">
          <div className="text-xl font-bold tracking-tight text-red-900 sm:text-2xl">
            {overdueCount}
          </div>
          <div className="text-xs font-semibold text-red-700">
            Overdue
          </div>
        </div>
      </div>

      {/* Due Today */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50/70 p-3 text-center sm:flex-row sm:justify-start sm:gap-3 sm:p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mb-1.5 sm:mb-0">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="sm:text-left">
          <div className="text-xl font-bold tracking-tight text-indigo-900 sm:text-2xl">
            {todayCount}
          </div>
          <div className="text-xs font-semibold text-indigo-700">
            Due Today
          </div>
        </div>
      </div>

      {/* Needs Date */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-center sm:flex-row sm:justify-start sm:gap-3 sm:p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-1.5 sm:mb-0">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div className="sm:text-left">
          <div className="text-xl font-bold tracking-tight text-amber-950 sm:text-2xl">
            {needsDateCount}
          </div>
          <div className="text-xs font-semibold text-amber-800">
            Needs Date
          </div>
        </div>
      </div>
    </div>
  );
}
