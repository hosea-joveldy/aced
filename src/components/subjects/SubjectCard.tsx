import type { Subject } from '@/types';
import { User, KeyRound, Pencil } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
}

export function SubjectCard({ subject, onEdit }: SubjectCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm hover:border-border/80 transition">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-foreground">
            {subject.name}
          </h3>
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-input bg-background p-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title={`Edit ${subject.name}`}
            aria-label={`Edit ${subject.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>{subject.teacherName}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Google Classroom</span>
        {subject.classroomCode ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-mono font-medium text-secondary-foreground border border-border">
            <KeyRound className="h-3 w-3 text-muted-foreground" />
            <span>{subject.classroomCode}</span>
          </span>
        ) : (
          <span className="text-xs italic text-muted-foreground">None</span>
        )}
      </div>
    </div>
  );
}
