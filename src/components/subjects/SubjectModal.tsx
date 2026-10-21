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
    } else {
      setName('');
      setTeacherName('');
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-3xl border border-[#E2E1DA] bg-[#FAF9F5] p-6 sm:p-7 shadow-2xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#E8E7E0] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFEFE9] text-[#141413]">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 id="subject-modal-title" className="text-lg font-serif font-semibold text-[#141413]">
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full p-1.5 text-[#73726C] hover:bg-[#EAE9E2] hover:text-[#141413] transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errors.general && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="subject-name"
              className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
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
              className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="teacher-name"
              className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
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
              className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition"
            />
            {errors.teacherName && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.teacherName}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E7E0]">
            {isEditing && subject && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(subject);
                }}
                disabled={isSubmitting}
                className="mr-auto min-h-[40px] rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition cursor-pointer"
              >
                Delete Subject
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[40px] rounded-full border border-[#DCDAD2] bg-white px-5 py-2 text-xs font-medium text-[#4A4A46] hover:bg-[#EFEFEA] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[40px] rounded-full bg-[#141413] px-6 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
