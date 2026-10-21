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
        className={`min-h-[36px] shrink-0 rounded-full px-4 py-1.5 text-xs transition cursor-pointer ${
          selectedSubjectId === null
            ? 'bg-[#141413] text-white font-semibold shadow-sm'
            : 'border border-[#D5D4CC] bg-white text-[#52524E] hover:text-[#141413] hover:bg-[#F2F1EB]'
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
            className={`min-h-[36px] shrink-0 rounded-full px-4 py-1.5 text-xs transition cursor-pointer ${
              isSelected
                ? 'bg-[#141413] text-white font-semibold shadow-sm'
                : 'border border-[#D5D4CC] bg-white text-[#52524E] hover:text-[#141413] hover:bg-[#F2F1EB]'
            }`}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
}
