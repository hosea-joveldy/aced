import type { Subject } from '@/types';

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
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none"
      aria-label="Subject filters"
    >
      <button
        type="button"
        onClick={() => onSelectSubject(null)}
        className={`min-h-[38px] shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
          selectedSubjectId === null
            ? 'bg-foreground text-background shadow-sm'
            : 'border border-border bg-card text-foreground hover:bg-muted'
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
            className={`min-h-[38px] shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
              isSelected
                ? 'bg-foreground text-background shadow-sm'
                : 'border border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
}
