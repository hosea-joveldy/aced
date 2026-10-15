import type { EditHistoryEntry } from '@/types';
import { RotateCcw, AlertTriangle, X, ArrowRight } from 'lucide-react';

interface RevertConfirmDialogProps {
  isOpen: boolean;
  entry: EditHistoryEntry | null;
  editorName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export function RevertConfirmDialog({
  isOpen,
  entry,
  editorName,
  onConfirm,
  onClose,
  isSubmitting,
}: RevertConfirmDialogProps) {
  if (!isOpen || !entry) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="revert-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/60 border border-red-900/40 text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 id="revert-dialog-title" className="text-base font-semibold text-zinc-100">
              Confirm Revert
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Are you sure you want to revert this edit on{' '}
            <strong className="text-zinc-100 font-semibold">{entry.assignmentTitle}</strong>?
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 rounded-xl border border-red-900/50 bg-red-950/30 p-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-400">
                Current (To Remove)
              </span>
              <div className="mt-1 text-sm font-mono font-medium text-red-200 line-through truncate">
                {entry.afterValue ?? '(none)'}
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-zinc-600 shrink-0 hidden sm:block" />

            <div className="w-full sm:flex-1 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                Restore To (Previous)
              </span>
              <div className="mt-1 text-sm font-mono font-medium text-emerald-200 truncate">
                {entry.beforeValue ?? '(none)'}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-950/60 border border-zinc-800/80 p-3 text-xs text-zinc-400">
            <span>Target Field: </span>
            <strong className="font-semibold text-zinc-200 uppercase">{entry.field}</strong>
            <p className="mt-1 text-zinc-500">
              This rollback will be transparently attributed to <strong className="text-zinc-300">{editorName}</strong> in the class audit log.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[40px] rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex min-h-[40px] items-center gap-2 rounded-lg bg-red-950/80 border border-red-800/80 px-4 py-2 text-xs font-semibold text-red-200 hover:bg-red-900 disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Reverting...' : 'Yes, Revert Edit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
