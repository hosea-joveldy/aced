export interface Class {
  id: string;
  code: string;
  name: string;
  leaderEmail: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  classId: string;
  name: string;
  teacherName: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  subjectId: string;
  title: string;
  dueDate: string | null; // 'YYYY-MM-DD' or null
  notes?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EditHistoryEntry {
  id: string;
  classId: string;
  assignmentId: string;
  assignmentTitle: string;
  field: string;
  beforeValue: string | null;
  afterValue: string | null;
  editorName: string;
  editorEmail?: string | null;
  timestamp: string; // ISO string
  reverted: boolean;
  revertedBy?: string | null;
  revertedAt?: string | null;
  entityType?: 'assignment' | 'subject';
  subjectId?: string | null;
  metadata?: {
    deletedSubject?: Subject;
    deletedAssignments?: Assignment[];
    [key: string]: unknown;
  } | null;
}

export interface StudentSession {
  email: string;
  displayName: string;
  classCode: string;
  classId: string;
  className: string;
  isClassLeader: boolean;
}
