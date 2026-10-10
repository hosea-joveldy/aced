import { useState, useEffect, useCallback } from 'react';
import type { EditHistoryEntry } from '@/types';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
import { HistoryCard } from '@/components/history/HistoryCard';
import { RevertConfirmDialog } from '@/components/history/RevertConfirmDialog';
import { History, AlertCircle, RotateCcw } from 'lucide-react';

export function HistoryScreen() {
  const repo = useRepository();
  const { session } = useSession();

  const [history, setHistory] = useState<EditHistoryEntry[]>([]);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Edit History & Undo
          </h2>
          <p className="text-sm text-muted-foreground">
            Audit trail of crowdsourced changes in {session?.className}
          </p>
        </div>
      </div>

      {/* Role notice banner */}
      <div
        className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-xs sm:text-sm ${
          isClassLeader
            ? 'border-indigo-200 bg-indigo-50/70 text-indigo-900'
            : 'border-amber-200 bg-amber-50/70 text-amber-900'
        }`}
      >
        <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${isClassLeader ? 'text-indigo-600' : 'text-amber-600'}`} />
        <div>
          {isClassLeader ? (
            <span>
              <strong>Class Leader Privileges:</strong> You have permission to revert and rollback changes to maintain board integrity.
            </span>
          ) : (
            <span>
              <strong>View Only:</strong> You can inspect the audit trail and who made changes. Only the designated Class Leader can revert edits.
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
              className="h-32 rounded-lg border border-border bg-muted/40 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-base font-bold text-red-900">
            Failed to Load History
          </h3>
          <p className="text-sm text-red-700 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadHistory}
            className="mt-4 flex min-h-[44px] items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {!isLoading && !error && history.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-3">
            <History className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Edits Recorded Yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Any addition, change, or deadline update made by classmates will appear here with transparent email attribution.
          </p>
        </div>
      )}

      {!isLoading && !error && history.length > 0 && (
        <div className="space-y-3">
          {history.map((entry) => (
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
