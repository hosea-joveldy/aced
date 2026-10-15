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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-primary">
              <FileEdit className="h-4 w-4" />
            </div>
            <h2 id="assignment-modal-title" className="text-lg font-bold text-foreground">
              {isEditing ? 'Edit Assignment' : 'Add New Assignment'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errors.general && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Wireframe Frame 5 Todoist-style layout */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="assignment-title"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
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
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm font-medium text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          {/* Wireframe Frame 5 row: Subject ▾ and Due date (optional) side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="assignment-subject"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
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
                className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.teacherName})
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <p className="mt-1 text-sm font-medium text-destructive">
                  {errors.subjectId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="assignment-due-date"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
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
                className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm font-mono"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm font-medium text-destructive">
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="assignment-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
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
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm resize-none"
            />
          </div>

          {/* Wireframe Frame 5 note */}
          <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
            <span>Your name is saved with this edit for class audit transparency.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[44px] rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-md cursor-pointer"
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
