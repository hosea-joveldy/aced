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
      {/* Overdue Tile */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E2E1DA] bg-white p-4 sm:p-5 hover:border-[#D5D4CC] transition shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
            <AlertCircle className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#141413]">
            {overdueCount}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
          <span className="text-xs font-semibold text-[#73726C] uppercase tracking-wider">
            Overdue
          </span>
        </div>
      </div>

      {/* Due Today Tile */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E2E1DA] bg-white p-4 sm:p-5 hover:border-[#D5D4CC] transition shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#141413]">
            {todayCount}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span className="text-xs font-semibold text-[#73726C] uppercase tracking-wider">
            Due Today
          </span>
        </div>
      </div>

      {/* Needs Date Tile */}
      <div className="flex flex-col justify-between rounded-3xl border border-[#E2E1DA] bg-white p-4 sm:p-5 hover:border-[#D5D4CC] transition shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#141413]">
            {needsDateCount}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          <span className="text-xs font-semibold text-[#73726C] uppercase tracking-wider">
            Needs Date
          </span>
        </div>
      </div>
    </div>
  );
}
