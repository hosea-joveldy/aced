import type { EditHistoryEntry } from '@/types';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

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
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h2 id="revert-dialog-title" className="text-lg font-bold text-foreground">
              Confirm Revert
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-foreground">
            Are you sure you want to revert this edit on{' '}
            <strong className="text-primary font-semibold">{entry.assignmentTitle}</strong>?
          </p>

          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs space-y-1.5 font-mono">
            <div>
              <span className="text-muted-foreground">Field: </span>
              <span className="font-semibold">{entry.field}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Current / After: </span>
              <span className="text-destructive font-medium line-through">
                {entry.afterValue ?? '(none)'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Restores To: </span>
              <span className="text-emerald-700 font-bold">
                {entry.beforeValue ?? '(none)'}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This undo will be attributed to <strong>{editorName}</strong> in the class history.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[44px] rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex min-h-[44px] items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{isSubmitting ? 'Reverting...' : 'Yes, Revert Edit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
