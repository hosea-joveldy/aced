import { useState, useEffect, useCallback, useMemo } from 'react';
import type { EditHistoryEntry } from '@/types';
import { useRepository } from '@/context/RepositoryContext';
import { useSession } from '@/context/SessionContext';
import { HistoryCard } from '@/components/history/HistoryCard';
import { RevertConfirmDialog } from '@/components/history/RevertConfirmDialog';
import { History, AlertCircle, RotateCcw, ShieldCheck, UserCheck, X, Check } from 'lucide-react';

type HistoryFilter = 'all' | 'dueDate' | 'title' | 'status';

export function HistoryScreen() {
  const repo = useRepository();
  const { session, reassignLeader, error: sessionError } = useSession();

  const [history, setHistory] = useState<EditHistoryEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Multi-selection state for Class Leader
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [entriesToRevert, setEntriesToRevert] = useState<EditHistoryEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [revertingProgress, setRevertingProgress] = useState<{ current: number; total: number } | null>(null);

  // Transfer leadership state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [transferStatus, setTransferStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);

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

  // Revertible entries in current view
  const revertibleEntries = useMemo(() => {
    return filteredHistory.filter((e) => !e.reverted && !e.field.startsWith('reverted'));
  }, [filteredHistory]);

  const isAllSelected =
    revertibleEntries.length > 0 &&
    revertibleEntries.every((e) => selectedIds.has(e.id));

  const handleToggleSelect = (entry: EditHistoryEntry) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(entry.id)) {
        next.delete(entry.id);
      } else {
        next.add(entry.id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(revertibleEntries.map((e) => e.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Open single revert dialog
  const handleOpenRevert = (entry: EditHistoryEntry) => {
    setEntriesToRevert([entry]);
    setIsDialogOpen(true);
  };

  // Open batch revert dialog for all selected entries
  const handleOpenBatchRevert = () => {
    const toRevert = history.filter(
      (e) => selectedIds.has(e.id) && !e.reverted && !e.field.startsWith('reverted')
    );
    if (toRevert.length === 0) return;
    setEntriesToRevert(toRevert);
    setIsDialogOpen(true);
  };

  // Execute revert action (single or batch)
  const handleConfirmRevert = async () => {
    if (entriesToRevert.length === 0 || !session) return;
    setIsReverting(true);
    setError(null);
    try {
      // Sort entries descending by timestamp so latest changes are rolled back first
      const sortedEntries = [...entriesToRevert].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime() || 0;
        const timeB = new Date(b.timestamp).getTime() || 0;
        return timeB - timeA;
      });

      setRevertingProgress({ current: 0, total: sortedEntries.length });
      for (let i = 0; i < sortedEntries.length; i++) {
        const item = sortedEntries[i];
        setRevertingProgress({ current: i + 1, total: sortedEntries.length });
        await repo.revertEdit(item.id, session.displayName, session.email);
      }

      await loadHistory();
      setIsDialogOpen(false);
      setEntriesToRevert([]);
      setSelectedIds(new Set());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to revert edits';
      setError(msg);
    } finally {
      setIsReverting(false);
      setRevertingProgress(null);
    }
  };

  const handleTransferLeadership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;
    setIsTransferring(true);
    setTransferStatus(null);
    try {
      const ok = await reassignLeader(targetEmail.trim());
      if (ok) {
        setTransferStatus({
          type: 'success',
          message: `Leadership successfully transferred to ${targetEmail.trim()}.`,
        });
        setTimeout(() => {
          setIsTransferOpen(false);
          setTargetEmail('');
          setTransferStatus(null);
        }, 1500);
      } else {
        setTransferStatus({
          type: 'error',
          message: sessionError || 'Failed to reassign leadership.',
        });
      }
    } catch (err: unknown) {
      setTransferStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to transfer leadership.',
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[#141413]">
            Edit History & Undo
          </h2>
          <p className="text-xs sm:text-sm text-[#73726C] mt-1">
            Audit trail of crowdsourced changes in <span className="font-medium text-[#141413]">{session?.className}</span>
          </p>
        </div>

        {/* Filter Chips: All edits, Due dates, Titles, Status */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="History filters">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`min-h-[34px] rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#141413] text-white shadow-sm'
                : 'border border-[#E2E1DA] bg-white text-[#73726C] hover:text-[#141413] hover:bg-[#F4F1EA]'
            }`}
          >
            All edits
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('dueDate')}
            className={`min-h-[34px] rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${
              activeFilter === 'dueDate'
                ? 'bg-[#141413] text-white shadow-sm'
                : 'border border-[#E2E1DA] bg-white text-[#73726C] hover:text-[#141413] hover:bg-[#F4F1EA]'
            }`}
          >
            Due dates
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('title')}
            className={`min-h-[34px] rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${
              activeFilter === 'title'
                ? 'bg-[#141413] text-white shadow-sm'
                : 'border border-[#E2E1DA] bg-white text-[#73726C] hover:text-[#141413] hover:bg-[#F4F1EA]'
            }`}
          >
            Titles
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('status')}
            className={`min-h-[34px] rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${
              activeFilter === 'status'
                ? 'bg-[#141413] text-white shadow-sm'
                : 'border border-[#E2E1DA] bg-white text-[#73726C] hover:text-[#141413] hover:bg-[#F4F1EA]'
            }`}
          >
            Status
          </button>
        </div>
      </div>

      {/* Role Notice Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border p-4 sm:p-5 text-xs sm:text-sm ${
          isClassLeader
            ? 'border-[#243B26]/30 bg-[#162417]/5 text-[#162417]'
            : 'border-[#E2E1DA] bg-white text-[#73726C]'
        }`}
      >
        <div className="flex items-start gap-3">
          {isClassLeader ? (
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#243B26] mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-[#8C8B82] mt-0.5" />
          )}
          <div className="leading-relaxed">
            {isClassLeader ? (
              <span>
                <strong className="text-[#141413] font-semibold">Class Leader privileges:</strong> You can select multiple timestamps to batch-revert edits or revert individually to preserve board integrity.
                <span className="text-[#73726C] text-xs ml-1">(other students see: View only)</span>
              </span>
            ) : (
              <span>
                <strong className="text-[#141413] font-semibold">View Only:</strong> You can inspect the audit trail and see who made changes. Only the designated Class Leader can revert edits.
              </span>
            )}
          </div>
        </div>

        {isClassLeader && (
          <button
            type="button"
            onClick={() => {
              setIsTransferOpen(true);
              setTransferStatus(null);
            }}
            className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full border border-[#243B26]/30 bg-white px-4 py-1.5 text-xs font-semibold text-[#162417] hover:bg-[#162417]/10 transition cursor-pointer shadow-xs"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Transfer Leadership</span>
          </button>
        )}
      </div>

      {/* Class Leader Multi-Selection Action Toolbar */}
      {isClassLeader && revertibleEntries.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E2E1DA] bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-3">
            <label className="relative flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#141413] select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="sr-only peer"
                aria-label="Select all revertible edits"
              />
              <div className="h-5 w-5 rounded-lg border border-[#D5D4CC] bg-white peer-checked:bg-[#141413] peer-checked:border-[#141413] flex items-center justify-center transition-all">
                <Check
                  className={`h-3.5 w-3.5 text-white transition-opacity ${
                    isAllSelected ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
              <span>Select all ({revertibleEntries.length})</span>
            </label>

            {selectedIds.size > 0 && (
              <span className="text-xs text-[#73726C] border-l border-[#E8E7E0] pl-3">
                <span className="font-semibold text-[#141413]">{selectedIds.size} selected</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="min-h-[34px] rounded-full px-3.5 py-1 text-xs font-medium text-[#73726C] hover:text-[#141413] hover:bg-[#F2F1EB] transition cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleOpenBatchRevert}
                  className="inline-flex min-h-[36px] items-center gap-2 rounded-full bg-[#141413] px-4 py-1.5 text-xs font-semibold text-white hover:bg-black transition cursor-pointer shadow-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Revert Selected ({selectedIds.size})</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isLoading && (
        <div role="status" aria-busy="true" className="space-y-4">
          <span className="sr-only">Loading edit history...</span>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-3xl border border-[#E2E1DA] bg-white/60 animate-pulse p-4"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="text-sm font-serif font-semibold text-red-900">
            Failed to Load History
          </h3>
          <p className="text-xs text-red-700 mt-1 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={loadHistory}
            className="mt-4 flex min-h-[40px] items-center gap-2 rounded-full border border-red-300 bg-white px-5 py-2 text-xs font-medium text-red-800 hover:bg-red-50 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {!isLoading && !error && filteredHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#DCDAD2] bg-white/50 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F1EA] text-[#73726C] mb-3">
            <History className="h-6 w-6" />
          </div>
          <h3 className="text-base font-serif font-semibold text-[#141413]">
            No Edits Match Filter
          </h3>
          <p className="text-xs sm:text-sm text-[#73726C] mt-1 max-w-sm mb-4">
            {activeFilter !== 'all'
              ? 'Try switching to "All edits" to view all history records.'
              : 'Any addition, change, or deadline update made by classmates will appear here with transparent email attribution.'}
          </p>
          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="min-h-[36px] rounded-full border border-[#DCDAD2] bg-white px-5 py-2 text-xs font-semibold text-[#141413] hover:bg-[#F4F1EA] transition cursor-pointer shadow-xs"
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
              isSelected={selectedIds.has(entry.id)}
              onToggleSelect={handleToggleSelect}
              onRevertClick={handleOpenRevert}
            />
          ))}
        </div>
      )}

      {/* Revert Dialog (Supports Single or Multiple/Batch) */}
      <RevertConfirmDialog
        isOpen={isDialogOpen}
        entry={entriesToRevert.length === 1 ? entriesToRevert[0] : null}
        entries={entriesToRevert}
        editorName={session?.displayName || 'Student'}
        onConfirm={handleConfirmRevert}
        onClose={() => {
          setIsDialogOpen(false);
          setEntriesToRevert([]);
        }}
        isSubmitting={isReverting}
        progress={revertingProgress}
      />

      {/* Transfer Leadership Modal */}
      {isTransferOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#E2E1DA] bg-[#FAF9F5] p-6 sm:p-8 shadow-2xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8E7E0] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#162417]/10 text-[#162417]">
                  <UserCheck className="h-4 w-4" />
                </div>
                <h3 id="transfer-dialog-title" className="text-lg font-serif font-semibold text-[#141413]">
                  Transfer Class Leadership
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTransferOpen(false)}
                className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full p-1.5 text-[#73726C] hover:bg-[#EAE9E2] hover:text-[#141413] transition cursor-pointer"
                aria-label="Close transfer dialog"
                disabled={isTransferring}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTransferLeadership} className="mt-5 space-y-4">
              <p className="text-xs sm:text-sm text-[#52524E] leading-relaxed">
                Assign a classmate to become the new Class Leader. They will receive rollback and undo permissions for <strong className="text-[#141413]">{session?.className}</strong>.
              </p>

              <div>
                <label htmlFor="target-email" className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Classmate's Email Address
                </label>
                <input
                  id="target-email"
                  type="email"
                  required
                  placeholder="e.g. classmate@school.edu"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  disabled={isTransferring}
                  className="w-full rounded-2xl border border-[#D5D4CC] bg-white px-4 py-2.5 text-sm text-[#141413] placeholder-[#A09F96] focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413]"
                />
              </div>

              {transferStatus && (
                <div
                  className={`rounded-2xl p-3 text-xs ${
                    transferStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {transferStatus.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  disabled={isTransferring}
                  className="min-h-[40px] rounded-full border border-[#DCDAD2] bg-white px-5 py-2 text-xs font-medium text-[#4A4A46] hover:bg-[#EFEFEA] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring || !targetEmail.trim()}
                  className="min-h-[40px] rounded-full bg-[#141413] px-6 py-2 text-xs font-semibold text-white hover:bg-black transition cursor-pointer disabled:opacity-50"
                >
                  {isTransferring ? 'Transferring...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
