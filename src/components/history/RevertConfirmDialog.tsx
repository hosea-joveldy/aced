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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-3xl border border-[#E2E1DA] bg-[#FAF9F5] p-6 sm:p-8 shadow-2xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#E8E7E0] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 id="revert-dialog-title" className="text-lg font-serif font-semibold text-[#141413]">
              Confirm Revert
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full p-1.5 text-[#73726C] hover:bg-[#EAE9E2] hover:text-[#141413] transition cursor-pointer"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-xs sm:text-sm text-[#52524E] leading-relaxed">
            Are you sure you want to revert this edit on{' '}
            <strong className="text-[#141413] font-semibold">{entry.assignmentTitle}</strong>?
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:flex-1 rounded-2xl border border-red-200 bg-red-50 p-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 font-bold">
                Current (To Remove)
              </span>
              <div className="mt-1 text-sm font-mono font-medium text-red-900 line-through truncate">
                {entry.afterValue ?? '(none)'}
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-[#73726C] shrink-0 hidden sm:block" />

            <div className="w-full sm:flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                Restore To (Previous)
              </span>
              <div className="mt-1 text-sm font-mono font-medium text-emerald-900 truncate">
                {entry.beforeValue ?? '(none)'}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F2F1EB] border border-[#E2E1DA] p-3.5 text-xs text-[#52524E]">
            <span>Target Field: </span>
            <strong className="font-semibold text-[#141413] uppercase">{entry.field}</strong>
            <p className="mt-1 text-[#73726C]">
              This rollback will be transparently attributed to <strong className="text-[#141413]">{editorName}</strong> in the class audit log.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E8E7E0] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[40px] rounded-full border border-[#DCDAD2] bg-white px-5 py-2 text-xs font-medium text-[#4A4A46] hover:bg-[#EFEFEA] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex min-h-[40px] items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Reverting...' : 'Yes, Revert Edit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
