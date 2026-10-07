import type { Class, Subject, Assignment, EditHistoryEntry } from '@/types';
import { getToday } from '@/lib/date';

export function offsetDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface LocalDatabaseSchema {
  classes: Class[];
  subjects: Subject[];
  assignments: Assignment[];
  history: EditHistoryEntry[];
}

export function createInitialSeedData(): LocalDatabaseSchema {
  const today = getToday();
  const classId = 'class-aced-2026';

  const demoClass: Class = {
    id: classId,
    code: 'ACED2026',
    name: 'Class of 2026 — Period 3',
    createdAt: offsetDate(today, -30),
  };

  const subjects: Subject[] = [
    {
      id: 'sub-calc',
      classId,
      name: 'AP Calculus BC',
      teacherName: 'Mr. Harrison',
      classroomCode: 'mat-401',
      createdAt: offsetDate(today, -30),
    },
    {
      id: 'sub-chem',
      classId,
      name: 'AP Chemistry',
      teacherName: 'Dr. Chen',
      classroomCode: 'sci-302',
      createdAt: offsetDate(today, -30),
    },
    {
      id: 'sub-eng',
      classId,
      name: 'English Literature',
      teacherName: 'Ms. Vance',
      classroomCode: 'eng-104',
      createdAt: offsetDate(today, -30),
    },
    {
      id: 'sub-hist',
      classId,
      name: 'World History',
      teacherName: 'Mr. Rodriguez',
      classroomCode: 'his-205',
      createdAt: offsetDate(today, -30),
    },
    {
      id: 'sub-cs',
      classId,
      name: 'Computer Science',
      teacherName: 'Mrs. Lin',
      classroomCode: 'cs-501',
      createdAt: offsetDate(today, -30),
    },
    {
      id: 'sub-art',
      classId,
      name: 'Art & Design',
      teacherName: 'Ms. Taylor',
      classroomCode: 'art-101',
      createdAt: offsetDate(today, -30),
    },
  ];

  // Exactly 6 subjects.
  // Assignments: 4 with no due date, 3 overdue, 2 due today or tomorrow, 1 done (spread over all 6 subjects). Total 10 assignments.
  const assignments: Assignment[] = [
    // Overdue 1 (Calc)
    {
      id: 'asg-1',
      classId,
      subjectId: 'sub-calc',
      title: 'Calculus Problem Set 4',
      dueDate: offsetDate(today, -3),
      notes: 'Problems 1-15 including odds',
      completed: false,
      createdAt: offsetDate(today, -10),
      updatedAt: offsetDate(today, -2),
    },
    // Overdue 2 (Chem)
    {
      id: 'asg-2',
      classId,
      subjectId: 'sub-chem',
      title: 'Lab Report: Thermodynamics',
      dueDate: offsetDate(today, -2),
      notes: 'Include error analysis section',
      completed: false,
      createdAt: offsetDate(today, -8),
      updatedAt: offsetDate(today, -2),
    },
    // Overdue 3 (English)
    {
      id: 'asg-3',
      classId,
      subjectId: 'sub-eng',
      title: 'Hamlet Essay Outline',
      dueDate: offsetDate(today, -1),
      notes: 'Thesis statement and three body paragraph arguments',
      completed: false,
      createdAt: offsetDate(today, -7),
      updatedAt: offsetDate(today, -1),
    },
    // Due today (History)
    {
      id: 'asg-4',
      classId,
      subjectId: 'sub-hist',
      title: 'History Chapter 14 Quiz Prep',
      dueDate: today,
      notes: 'Review Cold War alliances',
      completed: false,
      createdAt: offsetDate(today, -4),
      updatedAt: offsetDate(today, -1),
    },
    // Due tomorrow (CS)
    {
      id: 'asg-5',
      classId,
      subjectId: 'sub-cs',
      title: 'CS Binary Search Trees Implementation',
      dueDate: offsetDate(today, 1),
      notes: 'Implement insert, find, and traversal methods',
      completed: false,
      createdAt: offsetDate(today, -5),
      updatedAt: offsetDate(today, -1),
    },
    // Needs date 1 (Art)
    {
      id: 'asg-6',
      classId,
      subjectId: 'sub-art',
      title: 'Art Portfolio Brainstorm',
      dueDate: null,
      notes: 'Teacher announced verbally in class; deadline TBD',
      completed: false,
      createdAt: offsetDate(today, -3),
      updatedAt: offsetDate(today, -3),
    },
    // Needs date 2 (Calc)
    {
      id: 'asg-7',
      classId,
      subjectId: 'sub-calc',
      title: 'Integral Applications Worksheet',
      dueDate: null,
      notes: 'Handed out in class without set due date',
      completed: false,
      createdAt: offsetDate(today, -2),
      updatedAt: offsetDate(today, -2),
    },
    // Needs date 3 (Chem)
    {
      id: 'asg-8',
      classId,
      subjectId: 'sub-chem',
      title: 'Kinetics Pre-lab Questions',
      dueDate: null,
      notes: 'Complete before next lab session',
      completed: false,
      createdAt: offsetDate(today, -2),
      updatedAt: offsetDate(today, -2),
    },
    // Needs date 4 (English)
    {
      id: 'asg-9',
      classId,
      subjectId: 'sub-eng',
      title: 'Reading Response #3',
      dueDate: null,
      notes: 'Short reflection on Act 3 Scene 1',
      completed: false,
      createdAt: offsetDate(today, -1),
      updatedAt: offsetDate(today, -1),
    },
    // Done 1 (History)
    {
      id: 'asg-10',
      classId,
      subjectId: 'sub-hist',
      title: 'Primary Source Document Analysis',
      dueDate: offsetDate(today, -4),
      notes: 'Submitted via Google Classroom',
      completed: true,
      createdAt: offsetDate(today, -12),
      updatedAt: offsetDate(today, -4),
    },
  ];

  // At least 3 pre-existing edits for history and undo demo
  const history: EditHistoryEntry[] = [
    {
      id: 'hist-1',
      classId,
      assignmentId: 'asg-3',
      assignmentTitle: 'Hamlet Essay Outline',
      field: 'dueDate',
      beforeValue: offsetDate(today, -3),
      afterValue: offsetDate(today, -1),
      editorName: 'Alex M.',
      timestamp: offsetDate(today, -2) + 'T14:30:00Z',
      reverted: false,
    },
    {
      id: 'hist-2',
      classId,
      assignmentId: 'asg-1',
      assignmentTitle: 'Calculus Problem Set 4',
      field: 'notes',
      beforeValue: 'Problems 1-10 only',
      afterValue: 'Problems 1-15 including odds',
      editorName: 'Jordan K.',
      timestamp: offsetDate(today, -2) + 'T16:15:00Z',
      reverted: false,
    },
    {
      id: 'hist-3',
      classId,
      assignmentId: 'asg-5',
      assignmentTitle: 'CS Binary Search Trees Implementation',
      field: 'title',
      beforeValue: 'Binary Trees',
      afterValue: 'CS Binary Search Trees Implementation',
      editorName: 'Taylor S.',
      timestamp: offsetDate(today, -1) + 'T11:00:00Z',
      reverted: false,
    },
  ];

  return {
    classes: [demoClass],
    subjects,
    assignments,
    history,
  };
}
