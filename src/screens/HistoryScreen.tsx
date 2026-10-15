import { useState, useEffect, useCallback, useMemo } from 'react';
import type { EditHistoryEntry } from '@/types';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
import { HistoryCard } from '@/components/history/HistoryCard';
import { RevertConfirmDialog } from '@/components/history/RevertConfirmDialog';
import { History, AlertCircle, RotateCcw, ShieldCheck } from 'lucide-react';

type HistoryFilter = 'all' | 'dueDate' | 'title' | 'status';

export function HistoryScreen() {
  const repo = useRepository();
  const { session } = useSession();

  const [history, setHistory] = useState<EditHistoryEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEntry, setSelectedEntry] = useState<EditHistoryEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReverting, setIsReverting] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await repo.getHistory(session.classId);
      setHistory(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load edit history';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [repo, session]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleOpenRevert = (entry: EditHistoryEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handleConfirmRevert = async () => {
    if (!selectedEntry || !session) return;
    setIsReverting(true);
    try {
      await repo.revertEdit(selectedEntry.id, session.displayName, session.email);
      await loadHistory();
      setIsDialogOpen(false);
      setSelectedEntry(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to revert edit';
      setError(msg);
    } finally {
      setIsReverting(false);
    }
  };

  const isClassLeader = Boolean(session?.isClassLeader);

  // Filter history entries by active filter chip
  const filteredHistory = useMemo(() => {
    if (activeFilter === 'all') return history;
    if (activeFilter === 'dueDate') {
      return history.filter((e) => e.field === 'dueDate');
    }
    if (activeFilter === 'title') {
      return history.filter((e) => e.field === 'title');
    }
    if (activeFilter === 'status') {
      return history.filter((e) => e.field === 'completed' || e.field.startsWith('reverted'));
    }
    return history;
  }, [history, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
            Edit History & Undo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Audit trail of crowdsourced changes in {session?.className}
          </p>
        </div>

        {/* Filter Chips: All edits, Due dates, Titles, Status */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="History filters">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`min-h-[34px] rounded-full px-3.5 py-1 text-xs transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            All edits
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('dueDate')}
            className={`min-h-[34px] rounded-full px-3.5 py-1 text-xs transition cursor-pointer ${
              activeFilter === 'dueDate'
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Due dates
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('title')}
            className={`min-h-[34px] rounded-full px-3.5 py-1 text-xs transition cursor-pointer ${
              activeFilter === 'title'
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Titles
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('status')}
            className={`min-h-[34px] rounded-full px-3.5 py-1 text-xs transition cursor-pointer ${
              activeFilter === 'status'
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Status
          </button>
        </div>
      </div>

      {/* Role Notice Banner */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 text-xs sm:text-sm ${
          isClassLeader
            ? 'border-blue-900/40 bg-blue-950/20 text-blue-200'
            : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
        }`}
      >
        {isClassLeader ? (
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0 text-zinc-500 mt-0.5" />
        )}
        <div className="leading-relaxed">
          {isClassLeader ? (
            <span>
              <strong className="text-zinc-200">Class Leader privileges:</strong> You can revert edits to maintain board accuracy and integrity.
              <span className="text-zinc-400 text-xs ml-1">(students see: View only)</span>
            </span>
          ) : (
            <span>
              <strong className="text-zinc-300">View Only:</strong> You can inspect the audit trail and see who made changes. Only the designated Class Leader can revert edits.
            </span>
          )}
        </div>
      </div>

      {isLoading && (
        <div role="status" aria-busy="true" className="space-y-4">
          <span className="sr-only">Loading edit history...</span>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-zinc-800/80 bg-zinc-900/30 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-xl border border-red-900/50 bg-red-950/40 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
          <h3 className="text-sm font-semibold text-red-200">
            Failed to Load History
          </h3>
          <p className="text-xs text-red-300 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadHistory}
            className="mt-4 flex min-h-[40px] items-center gap-2 rounded-lg border border-red-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-red-300 hover:bg-zinc-800 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {!isLoading && !error && filteredHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 mb-3">
            <History className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">
            No Edits Match Filter
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mb-4">
            {activeFilter !== 'all'
              ? 'Try switching to "All edits" to view all history records.'
              : 'Any addition, change, or deadline update made by classmates will appear here with transparent email attribution.'}
          </p>
          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="min-h-[36px] rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
            >
              Show All Edits
            </button>
          )}
        </div>
      )}

      {/* Activity Feed Rows */}
      {!isLoading && !error && filteredHistory.length > 0 && (
        <div className="space-y-3">
          {filteredHistory.map((entry) => (
            <HistoryCard
              key={entry.id}
              entry={entry}
              canRevert={isClassLeader}
              onRevertClick={handleOpenRevert}
            />
          ))}
        </div>
      )}

      <RevertConfirmDialog
        isOpen={isDialogOpen}
        entry={selectedEntry}
        editorName={session?.displayName || 'Student'}
        onConfirm={handleConfirmRevert}
        onClose={() => setIsDialogOpen(false)}
        isSubmitting={isReverting}
      />
    </div>
  );
}
