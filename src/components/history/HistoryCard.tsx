import type { EditHistoryEntry } from '@/types';
import { RotateCcw, ArrowRight, Clock } from 'lucide-react';

interface HistoryCardProps {
  entry: EditHistoryEntry;
  canRevert: boolean;
  onRevertClick: (entry: EditHistoryEntry) => void;
}

export function HistoryCard({ entry, canRevert, onRevertClick }: HistoryCardProps) {
  const formattedDate = entry.timestamp ? entry.timestamp.split('T')[0] : '';

  const formatField = (field: string) => {
    switch (field) {
      case 'dueDate':
        return 'Due Date';
      case 'title':
        return 'Title';
      case 'notes':
        return 'Notes';
      case 'completed':
        return 'Completion Status';
      case 'created':
        return 'Created Assignment';
      default:
        return field;
    }
  };

  const isRevertLog = entry.field.startsWith('reverted');

  // Extract avatar initials
  const initials = entry.editorName
    ? entry.editorName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ED';

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition ${
        entry.reverted
          ? 'border-zinc-800/50 bg-zinc-950/40 opacity-70'
          : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-medium text-xs text-zinc-300 border border-zinc-700/60 shadow-sm mt-0.5">
          {initials}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Assignment title and field */}
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-medium text-zinc-100 truncate max-w-sm">
              {entry.assignmentTitle}
            </h4>
            <span className="inline-block rounded-md bg-zinc-950 px-2 py-0.5 text-[11px] font-medium text-zinc-400 border border-zinc-800">
              {formatField(entry.field)}
            </span>
          </div>

          {/* Attribution narrative */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
            <span className="font-medium text-zinc-300">
              {entry.editorName}
            </span>
            {entry.editorEmail && (
              <span className="text-zinc-500">({entry.editorEmail})</span>
            )}
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-zinc-500" />
              {formattedDate}
            </span>
            {entry.reverted && entry.revertedBy && (
              <>
                <span>•</span>
                <span className="text-blue-400 font-medium">
                  Undone by {entry.revertedBy}
                </span>
              </>
            )}
          </div>

          {/* Diff comparison pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-zinc-400">
              {entry.beforeValue ? entry.beforeValue : '(empty)'}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 font-semibold text-zinc-100">
              {entry.afterValue ? entry.afterValue : '(empty)'}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Reverted Badge */}
      <div className="flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
        {entry.reverted ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reverted</span>
          </span>
        ) : !isRevertLog && canRevert ? (
          <button
            type="button"
            onClick={() => onRevertClick(entry)}
            className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-600 transition shadow-sm cursor-pointer"
            aria-label={`Revert edit on ${entry.assignmentTitle}`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Revert</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
