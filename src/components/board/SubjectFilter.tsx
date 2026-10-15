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
        className={`min-h-[36px] shrink-0 rounded-full px-3.5 py-1 text-xs transition cursor-pointer ${
          selectedSubjectId === null
            ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
            : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
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
            className={`min-h-[36px] shrink-0 rounded-full px-3.5 py-1 text-xs transition cursor-pointer ${
              isSelected
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
}
