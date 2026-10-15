import { useState } from 'react';
import type { Assignment, Subject } from '@/types';
import { User, KeyRound, Pencil, CalendarPlus, Calendar, CheckCircle2, HelpCircle, RefreshCw, Trash2, Copy, Check } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  assignments?: Assignment[];
  onEdit: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
  onAssignDeadline?: (assignment: Assignment) => void;
  onSyncClassroom?: (subject: Subject) => Promise<void>;
}

// Generate consistent theme gradients for Google Classroom-style header banner
function getSubjectTheme(name: string) {
  const themes = [
    { bg: 'from-indigo-600 to-indigo-800', accent: 'bg-indigo-500/20 text-indigo-100' },
    { bg: 'from-emerald-600 to-teal-800', accent: 'bg-emerald-500/20 text-emerald-100' },
    { bg: 'from-amber-600 to-orange-700', accent: 'bg-amber-500/20 text-amber-100' },
    { bg: 'from-violet-600 to-purple-800', accent: 'bg-violet-500/20 text-purple-100' },
    { bg: 'from-rose-600 to-pink-800', accent: 'bg-rose-500/20 text-rose-100' },
    { bg: 'from-sky-600 to-blue-800', accent: 'bg-sky-500/20 text-sky-100' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
}

export function SubjectCard({
  subject,
  assignments = [],
  onEdit,
  onDelete,
  onAssignDeadline,
  onSyncClassroom,
}: SubjectCardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const theme = getSubjectTheme(subject.name);

  const activeAssignments = assignments.filter((a) => !a.completed);
  const missingDateAssignments = assignments.filter((a) => !a.completed && !a.dueDate);

  const handleCopyCode = async () => {
    if (!subject.classroomCode) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(subject.classroomCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const sortedClassroomAssignments = [...assignments].sort((a, b) => {
    if (!a.dueDate && b.dueDate) return -1;
    if (a.dueDate && !b.dueDate) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:border-foreground/20 hover:shadow-md transition">
      {/* Google Classroom-style 70px header banner matching wireframe Frame 3 */}
      <div className={`relative h-20 bg-gradient-to-r ${theme.bg} p-4 flex items-center justify-between text-white shadow-inner`}>
        <div className="min-w-0 pr-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Course Subject
          </span>
          <h3 className="truncate text-lg font-bold text-white drop-shadow-sm">
            {subject.name}
          </h3>
        </div>

        {/* Action icons on banner */}
        <div className="flex items-center gap-1.5 shrink-0 bg-black/20 backdrop-blur-sm rounded-lg p-1">
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md p-1.5 text-xs text-white/90 hover:bg-white/20 transition cursor-pointer"
            title={`Edit ${subject.name}`}
            aria-label={`Edit ${subject.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(subject)}
              className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md p-1.5 text-xs text-white/90 hover:bg-red-500/40 hover:text-red-100 transition cursor-pointer"
              title={`Delete ${subject.name}`}
              aria-label={`Delete ${subject.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Teacher name */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="font-medium text-foreground">{subject.teacherName}</span>
        </div>

        {/* Classroom Code & Copy Button Row */}
        <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
          <span className="text-xs font-medium text-muted-foreground">Classroom Code</span>
          {subject.classroomCode ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-mono font-semibold text-secondary-foreground border border-border">
                <KeyRound className="h-3 w-3 text-muted-foreground" />
                <span>{subject.classroomCode}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
                title="Copy Classroom Code"
                aria-label={`Copy code ${subject.classroomCode}`}
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <span className="text-xs italic text-muted-foreground">None</span>
          )}
        </div>

        {/* Stats Row matching wireframe Frame 3: "4 active · 1 missing date" */}
        <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs border border-border/60">
          <span className="font-semibold text-foreground">
            {activeAssignments.length} active · {missingDateAssignments.length} missing date
          </span>
          {missingDateAssignments.length > 0 && onAssignDeadline && (
            <button
              type="button"
              onClick={() => onAssignDeadline(missingDateAssignments[0])}
              className="inline-flex min-h-[36px] items-center gap-1 rounded bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900 hover:bg-amber-200 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
            >
              Add date
            </button>
          )}
        </div>

        {/* Classroom assignments list if code is present */}
        {subject.classroomCode && (
          <div
            className="space-y-2 rounded-lg bg-muted/30 p-2.5 border border-border/60"
            data-testid={`classroom-assignments-${subject.classroomCode}`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <div className="flex items-center gap-1.5">
                <span>Classroom Assignments ({sortedClassroomAssignments.length})</span>
                {onSyncClassroom && (
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={async () => {
                      setIsSyncing(true);
                      try {
                        await onSyncClassroom(subject);
                      } finally {
                        setIsSyncing(false);
                      }
                    }}
                    title={`Sync assignments from Google Classroom code ${subject.classroomCode}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline ml-1 min-h-[28px] px-1 cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                  </button>
                )}
              </div>
            </div>

            {sortedClassroomAssignments.length === 0 ? (
              <p className="text-xs italic text-muted-foreground py-1">
                No assignments posted in Classroom yet.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {sortedClassroomAssignments.slice(0, 3).map((asg) => (
                  <li
                    key={asg.id}
                    className="flex items-center justify-between gap-2 rounded border border-border bg-background px-2.5 py-1.5 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-medium truncate ${
                          asg.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {asg.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {asg.completed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Done {asg.dueDate ? `(${asg.dueDate})` : ''}
                          </span>
                        ) : asg.dueDate ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Due {asg.dueDate}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900">
                            <HelpCircle className="h-3 w-3 text-amber-700" />
                            No deadline set
                          </span>
                        )}
                      </div>
                    </div>

                    {onAssignDeadline && (
                      <button
                        type="button"
                        onClick={() => onAssignDeadline(asg)}
                        aria-label={`Assign deadline for ${asg.title}`}
                        className={`shrink-0 inline-flex min-h-[32px] items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition cursor-pointer ${
                          !asg.dueDate
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                            : 'border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <CalendarPlus className="h-3 w-3" />
                        <span>{!asg.dueDate ? 'Assign Date' : 'Set Date'}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
