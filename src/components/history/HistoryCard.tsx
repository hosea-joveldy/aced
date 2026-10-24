import type { EditHistoryEntry } from '@/types';
import { RotateCcw, ArrowRight, Clock, Check } from 'lucide-react';

interface HistoryCardProps {
  entry: EditHistoryEntry;
  canRevert: boolean;
  isSelected?: boolean;
  onToggleSelect?: (entry: EditHistoryEntry) => void;
  onRevertClick: (entry: EditHistoryEntry) => void;
}

export function HistoryCard({
  entry,
  canRevert,
  isSelected = false,
  onToggleSelect,
  onRevertClick,
}: HistoryCardProps) {
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    if (!timestamp.includes('T')) return timestamp;
    const [date, rest] = timestamp.split('T');
    const time = rest ? rest.slice(0, 5) : '';
    return time ? `${date} ${time}` : date;
  };

  const formattedTimestamp = formatTimestamp(entry.timestamp);

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

  const isRevertLog = entry.field.startsWith('reverted');
  const isSelectable = canRevert && !entry.reverted && !isRevertLog;

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
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('label')) {
          return;
        }
        if (isSelectable && onToggleSelect) {
          onToggleSelect(entry);
        }
      }}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border p-4 sm:p-5 transition shadow-sm ${
        entry.reverted
          ? 'border-[#E8E7E0] bg-[#F7F6F1] opacity-70'
          : isSelected
          ? 'border-[#141413] bg-[#FAF8F0] shadow-md ring-1 ring-[#141413]'
          : 'border-[#E2E1DA] bg-white hover:border-[#D5D4CC]'
      } ${isSelectable ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Selection Checkbox for Class Leader */}
        {isSelectable && (
          <div className="flex items-center self-center sm:self-auto pt-1 sm:pt-1.5">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect?.(entry)}
                className="sr-only peer"
                aria-label={`Select edit at ${formattedTimestamp} on ${entry.assignmentTitle}`}
              />
              <div className="h-5 w-5 rounded-lg border border-[#D5D4CC] bg-white peer-checked:bg-[#141413] peer-checked:border-[#141413] flex items-center justify-center transition-all">
                <Check
                  className={`h-3.5 w-3.5 text-white transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            </label>
          </div>
        )}

        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141413] font-bold text-xs text-white shadow-sm mt-0.5">
          {initials}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Assignment title and field */}
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm sm:text-base font-serif font-semibold text-[#141413] truncate max-w-sm">
              {entry.assignmentTitle}
            </h4>
            <span className="inline-block rounded-full bg-[#F2F1EB] px-3 py-0.5 text-[11px] font-semibold text-[#52524E] border border-[#E2E1DA]">
              {formatField(entry.field, entry.entityType)}
            </span>
          </div>

          {/* Attribution narrative */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#73726C]">
            <span className="font-semibold text-[#141413]">
              {entry.editorName}
            </span>
            {entry.editorEmail && (
              <span className="text-[#73726C]">({entry.editorEmail})</span>
            )}
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#52524E] bg-[#F2F1EB] px-2 py-0.5 rounded-md border border-[#E2E1DA]">
              <Clock className="h-3 w-3 text-[#73726C]" />
              <span>{formattedTimestamp}</span>
            </span>
            {entry.reverted && entry.revertedBy && (
              <>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">
                  Undone by {entry.revertedBy}
                </span>
              </>
            )}
          </div>

          {/* Diff comparison pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="rounded-xl border border-[#E2E1DA] bg-[#FAF9F5] px-3 py-1 text-[#73726C]">
              {entry.beforeValue ? entry.beforeValue : '(empty)'}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-[#73726C] shrink-0" />
            <span className="rounded-xl border border-[#D5D4CC] bg-[#EFEFE9] px-3 py-1 font-bold text-[#141413]">
              {entry.afterValue ? entry.afterValue : '(empty)'}
            </span>
          </div>
        </div>
      </div>

      {/* Action / Reverted Badge */}
      <div className="flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E7E0]">
        {entry.reverted ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5D4CC] bg-[#F2F1EB] px-3.5 py-1 text-xs font-semibold text-[#73726C]">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reverted</span>
          </span>
        ) : !isRevertLog && canRevert ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRevertClick(entry);
            }}
            className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#D5D4CC] bg-white px-4 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#F2F1EB] transition shadow-sm cursor-pointer"
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
