import type { EditHistoryEntry } from '@/types';
import { RotateCcw, User, Calendar, ArrowRight } from 'lucide-react';

interface HistoryCardProps {
  entry: EditHistoryEntry;
  canRevert: boolean;
  onRevertClick: (entry: EditHistoryEntry) => void;
}

export function HistoryCard({ entry, canRevert, onRevertClick }: HistoryCardProps) {
  // Format date display
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

  return (
    <div
      className={`flex flex-col justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm transition ${
        entry.reverted
          ? 'border-border/60 bg-muted/10 opacity-75'
          : 'border-border hover:border-border/80'
      }`}
    >
      <div className="space-y-2">
        {/* Header line: Title & Badge / Button */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-foreground">
              {entry.assignmentTitle}
            </h4>
            <span className="inline-block mt-0.5 rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
              {formatField(entry.field)}
            </span>
          </div>

          <div>
            {entry.reverted ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reverted</span>
              </span>
            ) : !isRevertLog ? (
              canRevert ? (
                <button
                  type="button"
                  onClick={() => onRevertClick(entry)}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-foreground transition shadow-sm"
                  aria-label={`Revert edit on ${entry.assignmentTitle}`}
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Revert</span>
                </button>
              ) : null
            ) : null}
          </div>
        </div>

        {/* Change Diff */}
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/20 p-2.5 text-xs font-mono">
          <span className="text-muted-foreground">
            {entry.beforeValue ? entry.beforeValue : '(empty)'}
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-semibold text-foreground">
            {entry.afterValue ? entry.afterValue : '(empty)'}
          </span>
        </div>
      </div>

      {/* Attribution footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium">
          <User className="h-3.5 w-3.5" />
          <span>
            Edited by {entry.editorName}
            {entry.editorEmail ? ` (${entry.editorEmail})` : ''}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
          {entry.reverted && entry.revertedBy && (
            <span className="text-muted-foreground ml-1">
              • Undone by {entry.revertedBy}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
