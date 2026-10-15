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
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm transition ${
        entry.reverted
          ? 'border-border/60 bg-muted/15 opacity-75'
          : 'border-border hover:border-foreground/20 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Wireframe Frame 4 circular avatar (.circ 34px) */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-xs text-indigo-700 border border-indigo-200 shadow-sm mt-0.5">
          {initials}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Assignment title and field */}
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-foreground truncate max-w-sm">
              {entry.assignmentTitle}
            </h4>
            <span className="inline-block rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground border border-border/80">
              {formatField(entry.field)}
            </span>
          </div>

          {/* Attribution narrative */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {entry.editorName}
            </span>
            {entry.editorEmail && (
              <span className="text-muted-foreground">({entry.editorEmail})</span>
            )}
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {formattedDate}
            </span>
            {entry.reverted && entry.revertedBy && (
              <>
                <span>•</span>
                <span className="text-indigo-600 font-medium">
                  Undone by {entry.revertedBy}
                </span>
              </>
            )}
          </div>

          {/* Wireframe Frame 4 Diff Pills (.diff) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 text-muted-foreground">
              {entry.beforeValue ? entry.beforeValue : '(empty)'}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="rounded-md border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 font-bold text-indigo-900">
              {entry.afterValue ? entry.afterValue : '(empty)'}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Reverted Badge */}
      <div className="flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
        {entry.reverted ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reverted</span>
          </span>
        ) : !isRevertLog && canRevert ? (
          <button
            type="button"
            onClick={() => onRevertClick(entry)}
            className="flex min-h-[38px] items-center gap-1.5 rounded-lg border border-input bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition shadow-sm cursor-pointer"
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
