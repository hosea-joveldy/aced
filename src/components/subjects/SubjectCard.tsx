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
    <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700 transition shadow-sm">
      {/* Minimalist course header bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/80 p-4 flex items-center justify-between text-zinc-100">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Course Subject
          </span>
          <h3 className="truncate text-base font-semibold text-zinc-100">
            {subject.name}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0 bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md p-1.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition cursor-pointer"
            title={`Edit ${subject.name}`}
            aria-label={`Edit ${subject.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(subject)}
              className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md p-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 transition cursor-pointer"
              title={`Delete ${subject.name}`}
              aria-label={`Delete ${subject.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Teacher name */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
          <User className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
          <span className="font-medium text-zinc-200">{subject.teacherName}</span>
        </div>

        {/* Classroom Code & Copy Button Row */}
        <div className="flex items-center justify-between gap-2 border-t border-zinc-800/80 pt-3">
          <span className="text-xs text-zinc-400">Classroom Code</span>
          {subject.classroomCode ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-950 px-2 py-0.5 text-xs font-mono font-semibold text-zinc-300 border border-zinc-800">
                <KeyRound className="h-3 w-3 text-zinc-500" />
                <span>{subject.classroomCode}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex min-h-[30px] items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition cursor-pointer"
                title="Copy Classroom Code"
                aria-label={`Copy code ${subject.classroomCode}`}
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <span className="text-xs italic text-zinc-500">None</span>
          )}
        </div>

        {/* Stats Row: "4 active · 1 missing date" */}
        <div className="flex items-center justify-between gap-2 rounded-lg bg-zinc-950/60 px-3 py-2 text-xs border border-zinc-800/80">
          <span className="text-zinc-300">
            {activeAssignments.length} active · {missingDateAssignments.length} missing date
          </span>
          {missingDateAssignments.length > 0 && onAssignDeadline && (
            <button
              type="button"
              onClick={() => onAssignDeadline(missingDateAssignments[0])}
              className="inline-flex min-h-[28px] items-center gap-1 rounded bg-amber-950/60 border border-amber-900/50 px-2 py-0.5 text-xs font-medium text-amber-300 hover:bg-amber-900/70 transition cursor-pointer"
            >
              Add date
            </button>
          )}
        </div>

        {/* Classroom assignments list if code is present */}
        {subject.classroomCode && (
          <div
            className="space-y-2 rounded-lg bg-zinc-950/40 p-2.5 border border-zinc-800/60"
            data-testid={`classroom-assignments-${subject.classroomCode}`}
          >
            <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
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
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 ml-1 min-h-[24px] px-1 cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                  </button>
                )}
              </div>
            </div>

            {sortedClassroomAssignments.length === 0 ? (
              <p className="text-xs italic text-zinc-500 py-1">
                No assignments posted in Classroom yet.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {sortedClassroomAssignments.slice(0, 3).map((asg) => (
                  <li
                    key={asg.id}
                    className="flex items-center justify-between gap-2 rounded border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1.5 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate font-medium ${
                          asg.completed
                            ? 'line-through text-zinc-500'
                            : 'text-zinc-200'
                        }`}
                      >
                        {asg.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {asg.completed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Done {asg.dueDate ? `(${asg.dueDate})` : ''}
                          </span>
                        ) : asg.dueDate ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                            <Calendar className="h-3 w-3 text-zinc-500" />
                            Due {asg.dueDate}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-950/40 border border-amber-900/50 px-1.5 py-0.2 text-[10px] font-medium text-amber-400">
                            <HelpCircle className="h-3 w-3 text-amber-400" />
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
                        className={`shrink-0 inline-flex min-h-[28px] items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition cursor-pointer ${
                          !asg.dueDate
                            ? 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200'
                            : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
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
