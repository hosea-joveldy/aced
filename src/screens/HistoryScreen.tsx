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
      {/* Top Header Row matching wireframe Frame 4 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Edit History & Undo
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit trail of crowdsourced changes in {session?.className}
          </p>
        </div>

        {/* Wireframe Frame 4 Filter Chips: All edits, Due dates, Titles, Status */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="History filters">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-ring ${
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            All edits
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('dueDate')}
            className={`min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-ring ${
              activeFilter === 'dueDate'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            Due dates
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('title')}
            className={`min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-ring ${
              activeFilter === 'title'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            Titles
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('status')}
            className={`min-h-[36px] rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-ring ${
              activeFilter === 'status'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            Status
          </button>
        </div>
      </div>

      {/* Role Notice Banner matching wireframe Frame 4 */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 text-xs sm:text-sm shadow-sm ${
          isClassLeader
            ? 'border-blue-200 bg-blue-50/80 text-blue-950'
            : 'border-amber-200 bg-amber-50/80 text-amber-950'
        }`}
      >
        {isClassLeader ? (
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        )}
        <div className="leading-relaxed">
          {isClassLeader ? (
            <span>
              <strong>Class Leader privileges:</strong> You can revert edits to maintain board accuracy and integrity.
              <span className="text-blue-800/80 text-xs ml-1">(students see: View only)</span>
            </span>
          ) : (
            <span>
              <strong>View Only:</strong> You can inspect the audit trail and see who made changes. Only the designated Class Leader can revert edits.
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
              className="h-28 rounded-xl border border-border bg-muted/40 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-base font-bold text-red-900">
            Failed to Load History
          </h3>
          <p className="text-sm text-red-700 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadHistory}
            className="mt-4 flex min-h-[44px] items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {!isLoading && !error && filteredHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-3">
            <History className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Edits Match Filter
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-4">
            {activeFilter !== 'all'
              ? 'Try switching to "All edits" to view all history records.'
              : 'Any addition, change, or deadline update made by classmates will appear here with transparent email attribution.'}
          </p>
          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="min-h-[40px] rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-sm cursor-pointer"
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
