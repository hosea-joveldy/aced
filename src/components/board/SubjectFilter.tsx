import type { Subject } from '@/types';
import { Filter } from 'lucide-react';

interface SubjectFilterProps {
  subjects: Subject[];
  selectedSubjectId: string | null;
  onSelectSubject: (subjectId: string | null) => void;
}

export function SubjectFilter({
  subjects,
  selectedSubjectId,
  onSelectSubject,
}: SubjectFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none" aria-label="Subject filters">
      <div className="flex items-center text-xs font-semibold text-muted-foreground mr-1 shrink-0">
        <Filter className="h-3.5 w-3.5 mr-1" />
        <span>Filter:</span>
      </div>

      <button
        type="button"
        onClick={() => onSelectSubject(null)}
        className={`min-h-[44px] shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
          selectedSubjectId === null
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'border border-input bg-background text-foreground hover:bg-muted'
        }`}
      >
        All Subjects
      </button>

      {subjects.map((sub) => {
        const isSelected = selectedSubjectId === sub.id;
        return (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelectSubject(sub.id)}
            className={`min-h-[44px] shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-input bg-background text-foreground hover:bg-muted'
            }`}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
}
