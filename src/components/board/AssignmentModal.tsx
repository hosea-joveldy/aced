import { useState, useEffect, type FormEvent } from 'react';
import type { Assignment, Subject } from '@/types';
import { isValidDateString } from '@/lib/date';
import { X, FileEdit, AlertCircle, Info } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: Assignment | null;
  subjects: Subject[];
  onSave: (data: {
    title: string;
    subjectId: string;
    dueDate: string | null;
    notes?: string | null;
  }) => Promise<void>;
}

export function AssignmentModal({
  isOpen,
  onClose,
  assignment,
  subjects,
  onSave,
}: AssignmentModalProps) {
  const isEditing = Boolean(assignment);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    subjectId?: string;
    dueDate?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setSubjectId(assignment.subjectId);
      setDueDate(assignment.dueDate || '');
      setNotes(assignment.notes || '');
    } else {
      setTitle('');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setDueDate('');
      setNotes('');
    }
    setErrors({});
  }, [assignment, subjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; subjectId?: string; dueDate?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }

    if (!subjectId) {
      newErrors.subjectId = 'Please select a subject.';
    }

    const trimmedDueDate = dueDate.trim();
    if (trimmedDueDate && !isValidDateString(trimmedDueDate)) {
      newErrors.dueDate = 'Due date must be a valid date in YYYY-MM-DD format.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSave({
        title: title.trim(),
        subjectId,
        dueDate: trimmedDueDate || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save assignment';
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-3xl border border-[#E2E1DA] bg-[#FAF9F5] p-6 sm:p-8 shadow-2xl animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E8E7E0] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFEFE9] text-[#141413]">
              <FileEdit className="h-4 w-4" />
            </div>
            <h2 id="assignment-modal-title" className="text-lg font-serif font-semibold text-[#141413]">
              {isEditing ? 'Edit Assignment' : 'Add New Assignment'}
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
            className="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-900"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="assignment-title"
              className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
            >
              Assignment Title *
            </label>
            <input
              id="assignment-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Chapter 4 Calculus Problem Set"
              disabled={isSubmitting}
              className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition"
            />
            {errors.title && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="assignment-subject"
                className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
              >
                Subject *
              </label>
              <select
                id="assignment-subject"
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  if (errors.subjectId)
                    setErrors((prev) => ({ ...prev, subjectId: undefined }));
                }}
                disabled={isSubmitting || subjects.length === 0}
                className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-white px-3 py-2 text-base sm:text-sm text-[#141413] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition cursor-pointer"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.teacherName})
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.subjectId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="assignment-due-date"
                className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
              >
                Due Date (optional, YYYY-MM-DD)
              </label>
              <input
                id="assignment-due-date"
                type="text"
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate)
                    setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }}
                disabled={isSubmitting}
                className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition font-mono"
              />
              {errors.dueDate && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="assignment-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
            >
              Notes & Instructions (optional)
            </label>
            <textarea
              id="assignment-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Problems 1-15, show all work"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#DCDAD2] bg-white px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition resize-none"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl bg-[#F2F1EB] border border-[#E2E1DA] px-3.5 py-2 text-xs text-[#52524E]">
            <Info className="h-4 w-4 shrink-0 text-[#73726C]" />
            <span>Your name will be recorded in the audit history for class transparency.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E7E0]">
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
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
