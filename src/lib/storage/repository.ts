import type {
  Class,
  Subject,
  Assignment,
  EditHistoryEntry,
} from '@/types';

export interface CreateAssignmentInput {
  subjectId: string;
  title: string;
  dueDate: string | null;
  notes?: string | null;
}

export interface UpdateAssignmentInput {
  subjectId?: string;
  title?: string;
  dueDate?: string | null;
  notes?: string | null;
}

export interface CreateSubjectInput {
  name: string;
  teacherName: string;
  classroomCode?: string | null;
}

export interface UpdateSubjectInput {
  name?: string;
  teacherName?: string;
  classroomCode?: string | null;
}

export interface AcedRepository {
  // Class lookup
  getClassByCode(code: string): Promise<Class | null>;
  getClassById(id: string): Promise<Class | null>;

  // Subjects
  getSubjects(classId: string): Promise<Subject[]>;
  createSubject(classId: string, input: CreateSubjectInput): Promise<Subject>;
  updateSubject(id: string, input: UpdateSubjectInput): Promise<Subject>;

  // Assignments
  getAssignments(classId: string): Promise<Assignment[]>;
  createAssignment(
    classId: string,
    input: CreateAssignmentInput,
    editorName: string
  ): Promise<Assignment>;
  updateAssignment(
    id: string,
    input: UpdateAssignmentInput,
    editorName: string
  ): Promise<Assignment>;
  toggleAssignmentComplete(
    id: string,
    completed: boolean,
    editorName: string
  ): Promise<Assignment>;

  // Edit History & Undo
  getHistory(classId: string): Promise<EditHistoryEntry[]>;
  revertEdit(historyId: string, editorName: string): Promise<void>;
}
