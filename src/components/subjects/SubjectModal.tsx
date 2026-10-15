import { useState, useEffect, type FormEvent } from 'react';
import type { Subject } from '@/types';
import { X, BookOpen, AlertCircle } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject | null;
  onSave: (data: {
    name: string;
    teacherName: string;
    classroomCode?: string | null;
  }) => Promise<void>;
  onDelete?: (subject: Subject) => void;
}

export function SubjectModal({
  isOpen,
  onClose,
  subject,
  onSave,
  onDelete,
}: SubjectModalProps) {
  const isEditing = Boolean(subject);
  const [name, setName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [classroomCode, setClassroomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    teacherName?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setTeacherName(subject.teacherName);
      setClassroomCode(subject.classroomCode || '');
    } else {
      setName('');
      setTeacherName('');
      setClassroomCode('');
    }
    setErrors({});
  }, [subject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; teacherName?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Subject name is required.';
    }
    if (!teacherName.trim()) {
      newErrors.teacherName = 'Teacher name is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSave({
        name: name.trim(),
        teacherName: teacherName.trim(),
        classroomCode: classroomCode.trim() || null,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save subject';
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="subject-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 id="subject-modal-title" className="text-base font-semibold text-zinc-100">
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errors.general && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="subject-name"
              className="block text-xs font-medium text-zinc-300 mb-1.5"
            >
              Subject Name *
            </label>
            <input
              id="subject-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. AP Biology"
              disabled={isSubmitting}
              className="w-full min-h-[44px] rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition shadow-inner"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="teacher-name"
              className="block text-xs font-medium text-zinc-300 mb-1.5"
            >
              Teacher Name *
            </label>
            <input
              id="teacher-name"
              type="text"
              value={teacherName}
              onChange={(e) => {
                setTeacherName(e.target.value);
                if (errors.teacherName)
                  setErrors((prev) => ({ ...prev, teacherName: undefined }));
              }}
              placeholder="e.g. Dr. Sanchez"
              disabled={isSubmitting}
              className="w-full min-h-[44px] rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition shadow-inner"
            />
            {errors.teacherName && (
              <p className="mt-1 text-xs font-medium text-red-400">
                {errors.teacherName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="classroom-code"
              className="block text-xs font-medium text-zinc-300 mb-1.5"
            >
              Google Classroom Code (optional)
            </label>
            <input
              id="classroom-code"
              type="text"
              value={classroomCode}
              onChange={(e) => setClassroomCode(e.target.value)}
              placeholder="e.g. bio-402"
              disabled={isSubmitting}
              className="w-full min-h-[44px] rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition shadow-inner"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            {isEditing && subject && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(subject);
                }}
                disabled={isSubmitting}
                className="mr-auto min-h-[40px] rounded-lg border border-red-900/40 bg-red-950/40 px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-900/60 transition cursor-pointer"
              >
                Delete Subject
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[40px] rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[40px] rounded-lg bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
