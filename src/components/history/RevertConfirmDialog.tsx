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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5 text-destructive">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 id="revert-dialog-title" className="text-lg font-bold text-foreground">
              Confirm Revert
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            Are you sure you want to revert this edit on{' '}
            <strong className="text-foreground font-bold">{entry.assignmentTitle}</strong>?
          </p>

          {/* Wireframe Frame 6 side-by-side comparison cards */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 rounded-xl border border-red-200 bg-red-50/70 p-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
                Current (To Remove)
              </span>
              <div className="mt-1 text-base font-mono font-bold text-red-900 line-through truncate">
                {entry.afterValue ?? '(none)'}
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 hidden sm:block" />

            <div className="w-full sm:flex-1 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Restore To (Previous)
              </span>
              <div className="mt-1 text-base font-mono font-bold text-emerald-900 truncate">
                {entry.beforeValue ?? '(none)'}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            <span>Target Field: </span>
            <strong className="font-semibold text-foreground uppercase">{entry.field}</strong>
            <p className="mt-1">
              This rollback will be transparently attributed to <strong>{editorName}</strong> in the class audit log.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[44px] rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex min-h-[44px] items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 shadow-md cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{isSubmitting ? 'Reverting...' : 'Yes, Revert Edit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
