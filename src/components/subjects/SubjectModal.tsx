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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-0 zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 id="subject-modal-title" className="text-lg font-bold text-foreground">
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="subject-name"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
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
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm font-medium text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="teacher-name"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
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
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
            {errors.teacherName && (
              <p className="mt-1 text-sm font-medium text-destructive">
                {errors.teacherName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="classroom-code"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
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
              className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-base font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            {isEditing && subject && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(subject);
                }}
                disabled={isSubmitting}
                className="mr-auto min-h-[44px] rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-sm font-semibold text-destructive hover:bg-destructive/20 transition cursor-pointer"
              >
                Delete Subject
              </button>
            )}
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
