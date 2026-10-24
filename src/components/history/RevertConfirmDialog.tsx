import type { EditHistoryEntry } from '@/types';
import { RotateCcw, AlertTriangle, X, ArrowRight, Clock } from 'lucide-react';

interface RevertConfirmDialogProps {
  isOpen: boolean;
  entry?: EditHistoryEntry | null;
  entries?: EditHistoryEntry[];
  editorName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  progress?: { current: number; total: number } | null;
}

export function RevertConfirmDialog({
  isOpen,
  entry,
  entries = [],
  editorName,
  onConfirm,
  onClose,
  isSubmitting,
  progress,
}: RevertConfirmDialogProps) {
  if (!isOpen) return null;

  // Resolve target entries list
  const effectiveEntries: EditHistoryEntry[] =
    entries.length > 0 ? entries : entry ? [entry] : [];

  if (effectiveEntries.length === 0) return null;

  const isBatch = effectiveEntries.length > 1;
  const singleEntry = effectiveEntries[0];

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    if (!timestamp.includes('T')) return timestamp;
    const [date, rest] = timestamp.split('T');
    const time = rest ? rest.slice(0, 5) : '';
    return time ? `${date} ${time}` : date;
  };

  const formatField = (field: string, entityType?: string) => {
    switch (field) {
      case 'dueDate':
        return 'Due Date';
      case 'title':
        return 'Title';
      case 'name':
        return 'Subject Name';
      case 'teacherName':
        return 'Teacher Name';
      case 'subjectId':
        return 'Subject';
      case 'notes':
        return 'Notes';
      case 'completed':
        return 'Completion Status';
      case 'created':
        return entityType === 'subject' ? 'Created Subject' : 'Created Assignment';
      case 'createdSubject':
        return 'Created Subject';
      case 'deleted':
        return entityType === 'subject' ? 'Deleted Subject' : 'Deleted Assignment';
      case 'deletedSubject':
        return 'Deleted Subject';
      default:
        return field;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="revert-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-3xl border border-[#E2E1DA] bg-[#FAF9F5] p-6 sm:p-8 shadow-2xl animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#E8E7E0] pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h2 id="revert-dialog-title" className="text-lg font-serif font-semibold text-[#141413]">
              {isBatch ? `Confirm Revert (${effectiveEntries.length} edits)` : 'Confirm Revert'}
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

        <div className="mt-5 space-y-4 overflow-y-auto pr-1 flex-1">
          {!isBatch ? (
            <>
              <p className="text-xs sm:text-sm text-[#52524E] leading-relaxed">
                Are you sure you want to revert this edit on{' '}
                <strong className="text-[#141413] font-semibold">{singleEntry.assignmentTitle}</strong>?
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:flex-1 rounded-2xl border border-red-200 bg-red-50 p-3.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 font-bold">
                    Current (To Remove)
                  </span>
                  <div className="mt-1 text-sm font-mono font-medium text-red-900 line-through truncate">
                    {singleEntry.afterValue ?? '(none)'}
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-[#73726C] shrink-0 hidden sm:block" />

                <div className="w-full sm:flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                    Restore To (Previous)
                  </span>
                  <div className="mt-1 text-sm font-mono font-medium text-emerald-900 truncate">
                    {singleEntry.beforeValue ?? '(none)'}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#F2F1EB] border border-[#E2E1DA] p-3.5 text-xs text-[#52524E]">
                <span>Target Field: </span>
                <strong className="font-semibold text-[#141413]">
                  {formatField(singleEntry.field, singleEntry.entityType)}
                </strong>
                <p className="mt-1 text-[#73726C]">
                  This rollback will be transparently attributed to <strong className="text-[#141413]">{editorName}</strong> in the class audit log.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-[#52524E] leading-relaxed">
                Are you sure you want to revert these <strong className="text-[#141413] font-semibold">{effectiveEntries.length} edits</strong>? The edits will be rolled back in reverse order.
              </p>

              <div className="space-y-2.5 max-h-60 overflow-y-auto rounded-2xl border border-[#E2E1DA] bg-white p-3">
                {effectiveEntries.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#EAE9E2] bg-[#FAF9F5] p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#141413] truncate max-w-[200px]">
                        {item.assignmentTitle}
                      </span>
                      <span className="font-mono text-[10px] text-[#73726C] inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#F2F1EB] px-2 py-0.5 text-[10px] font-semibold text-[#52524E]">
                        {formatField(item.field, item.entityType)}
                      </span>
                      <span className="text-[#73726C]">•</span>
                      <div className="flex items-center gap-1 font-mono text-[11px] truncate">
                        <span className="text-red-700 line-through truncate max-w-[90px]">
                          {item.afterValue || '(empty)'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-[#73726C] shrink-0" />
                        <span className="text-emerald-800 font-semibold truncate max-w-[90px]">
                          {item.beforeValue || '(empty)'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-[#F2F1EB] border border-[#E2E1DA] p-3.5 text-xs text-[#52524E]">
                <p className="text-[#73726C]">
                  All rollbacks will be transparently attributed to <strong className="text-[#141413]">{editorName}</strong> in the class audit log.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E8E7E0] pt-4 shrink-0">
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
            <span>
              {isSubmitting
                ? progress
                  ? `Reverting (${progress.current}/${progress.total})...`
                  : 'Reverting...'
                : isBatch
                ? `Yes, Revert ${effectiveEntries.length} Edits`
                : 'Yes, Revert Edit'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
