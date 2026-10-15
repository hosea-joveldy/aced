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
      <div className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 sm:p-4 hover:border-zinc-700 transition">
        <div className="flex items-center justify-between">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-950/50 border border-red-900/50 text-red-400">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            {overdueCount}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Overdue
          </span>
        </div>
      </div>

      {/* Due Today Tile */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 sm:p-4 hover:border-zinc-700 transition">
        <div className="flex items-center justify-between">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-950/50 border border-blue-900/50 text-blue-400">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            {todayCount}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Due Today
          </span>
        </div>
      </div>

      {/* Needs Date Tile */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 sm:p-4 hover:border-zinc-700 transition">
        <div className="flex items-center justify-between">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-950/50 border border-amber-900/50 text-amber-400">
            <HelpCircle className="h-3.5 w-3.5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            {needsDateCount}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Needs Date
          </span>
        </div>
      </div>
    </div>
  );
}
