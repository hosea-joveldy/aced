import type {
  Class,
  Subject,
  Assignment,
  EditHistoryEntry,
} from '@/types';
import type {
  AcedRepository,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  CreateSubjectInput,
  UpdateSubjectInput,
} from './repository';
import { createInitialSeedData, type LocalDatabaseSchema } from './seed';
import { getToday } from '@/lib/date';

const STORAGE_KEY = 'aced.db.v1';

export class LocalRepository implements AcedRepository {
  private key: string;

  constructor(key = STORAGE_KEY) {
    this.key = key;
  }

  private loadData(): LocalDatabaseSchema {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createInitialSeedData();
    }

    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) {
        const seed = createInitialSeedData();
        this.saveData(seed);
        return seed;
      }
      return JSON.parse(raw) as LocalDatabaseSchema;
    } catch {
      const seed = createInitialSeedData();
      this.saveData(seed);
      return seed;
    }
  }

  private saveData(data: LocalDatabaseSchema): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.key, JSON.stringify(data));
    }
  }

  public async resetDatabase(): Promise<void> {
    const seed = createInitialSeedData();
    this.saveData(seed);
  }

  async getClassByCode(code: string): Promise<Class | null> {
    const data = this.loadData();
    const normalized = code.trim().toUpperCase();
    const found = data.classes.find((c) => c.code.toUpperCase() === normalized);
    return found || null;
  }

  async getClassById(id: string): Promise<Class | null> {
    const data = this.loadData();
    return data.classes.find((c) => c.id === id) || null;
  }

  async createClass(
    name: string,
    leaderEmail: string,
    customCode?: string
  ): Promise<Class> {
    const data = this.loadData();
    const trimmedName = name.trim();
    const trimmedEmail = leaderEmail.trim().toLowerCase();

    // Generate clean alphanumeric code e.g. "ACED-7K2M" or use custom
    let code = (customCode?.trim().toUpperCase()) || '';
    if (!code) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `ACED-${randPart}`;
    }

    // Ensure unique code
    let uniqueCode = code;
    let counter = 1;
    while (data.classes.some((c) => c.code.toUpperCase() === uniqueCode.toUpperCase())) {
      uniqueCode = `${code}-${counter++}`;
    }

    const newClass: Class = {
      id: `class-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      code: uniqueCode,
      name: trimmedName,
      leaderEmail: trimmedEmail,
      createdAt: getToday(),
    };

    data.classes.push(newClass);
    this.saveData(data);
    return newClass;
  }

  async updateClassLeader(
    classId: string,
    newLeaderEmail: string
  ): Promise<Class> {
    const data = this.loadData();
    const cls = data.classes.find((c) => c.id === classId);
    if (!cls) {
      throw new Error(`Class with ID "${classId}" not found`);
    }

    cls.leaderEmail = newLeaderEmail.trim().toLowerCase();
    this.saveData(data);
    return cls;
  }

  async getSubjects(classId: string): Promise<Subject[]> {
    const data = this.loadData();
    return data.subjects.filter((s) => s.classId === classId);
  }

  async createSubject(
    classId: string,
    input: CreateSubjectInput,
    editorName?: string,
    editorEmail?: string
  ): Promise<Subject> {
    const data = this.loadData();
    const newSubject: Subject = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      classId,
      name: input.name.trim(),
      teacherName: input.teacherName.trim(),
      createdAt: getToday(),
    };
    data.subjects.push(newSubject);

    // Record subject creation in history
    data.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      classId,
      assignmentId: newSubject.id,
      assignmentTitle: newSubject.name,
      field: 'created',
      beforeValue: null,
      afterValue: `${newSubject.name} (${newSubject.teacherName})`,
      editorName: (editorName || 'Student').trim(),
      editorEmail: editorEmail ? editorEmail.trim() : null,
      timestamp: new Date().toISOString(),
      reverted: false,
      entityType: 'subject',
      subjectId: newSubject.id,
    });

    this.saveData(data);
    return newSubject;
  }

  async updateSubject(
    id: string,
    input: UpdateSubjectInput,
    editorName?: string,
    editorEmail?: string
  ): Promise<Subject> {
    const data = this.loadData();
    const index = data.subjects.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Subject with ID ${id} not found`);
    }

    const current = data.subjects[index];
    const nowIso = new Date().toISOString();
    const editor = (editorName || 'Student').trim();
    const email = editorEmail ? editorEmail.trim() : null;

    if (input.name !== undefined) {
      const beforeName = current.name;
      const afterName = input.name.trim();
      if (beforeName !== afterName) {
        data.history.unshift({
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          classId: current.classId,
          assignmentId: current.id,
          assignmentTitle: afterName,
          field: 'name',
          beforeValue: beforeName,
          afterValue: afterName,
          editorName: editor,
          editorEmail: email,
          timestamp: nowIso,
          reverted: false,
          entityType: 'subject',
          subjectId: current.id,
        });
      }
    }

    if (input.teacherName !== undefined) {
      const beforeTeacher = current.teacherName;
      const afterTeacher = input.teacherName.trim();
      if (beforeTeacher !== afterTeacher) {
        data.history.unshift({
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          classId: current.classId,
          assignmentId: current.id,
          assignmentTitle: input.name !== undefined ? input.name.trim() : current.name,
          field: 'teacherName',
          beforeValue: beforeTeacher,
          afterValue: afterTeacher,
          editorName: editor,
          editorEmail: email,
          timestamp: nowIso,
          reverted: false,
          entityType: 'subject',
          subjectId: current.id,
        });
      }
    }

    const updated: Subject = {
      ...current,
      name: input.name !== undefined ? input.name.trim() : current.name,
      teacherName:
        input.teacherName !== undefined
          ? input.teacherName.trim()
          : current.teacherName,
    };
    data.subjects[index] = updated;
    this.saveData(data);
    return updated;
  }

  async deleteSubject(
    id: string,
    editorName?: string,
    editorEmail?: string
  ): Promise<void> {
    const data = this.loadData();
    const subjectIndex = data.subjects.findIndex((s) => s.id === id);
    if (subjectIndex === -1) {
      return;
    }
    const subjectToDelete = data.subjects[subjectIndex];
    const deletedAssignments = data.assignments.filter((a) => a.subjectId === id);

    data.subjects = data.subjects.filter((s) => s.id !== id);
    data.assignments = data.assignments.filter((a) => a.subjectId !== id);

    const nowIso = new Date().toISOString();
    const editor = (editorName || 'Student').trim();
    const email = editorEmail ? editorEmail.trim() : null;

    data.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      classId: subjectToDelete.classId,
      assignmentId: subjectToDelete.id,
      assignmentTitle: subjectToDelete.name,
      field: 'deleted',
      beforeValue: `${subjectToDelete.name} (${subjectToDelete.teacherName})`,
      afterValue: null,
      editorName: editor,
      editorEmail: email,
      timestamp: nowIso,
      reverted: false,
      entityType: 'subject',
      subjectId: subjectToDelete.id,
      metadata: {
        deletedSubject: subjectToDelete,
        deletedAssignments,
      },
    });

    this.saveData(data);
  }

  async getAssignments(classId: string): Promise<Assignment[]> {
    const data = this.loadData();
    return data.assignments.filter((a) => a.classId === classId);
  }

  async createAssignment(
    classId: string,
    input: CreateAssignmentInput,
    editorName: string,
    editorEmail?: string
  ): Promise<Assignment> {
    const data = this.loadData();
    const today = getToday();
    const newAssignment: Assignment = {
      id: `asg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      classId,
      subjectId: input.subjectId,
      title: input.title.trim(),
      dueDate: input.dueDate || null,
      notes: input.notes?.trim() || null,
      completed: false,
      createdAt: today,
      updatedAt: today,
    };

    data.assignments.push(newAssignment);

    // Record creation in history
    data.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      classId,
      assignmentId: newAssignment.id,
      assignmentTitle: newAssignment.title,
      field: 'created',
      beforeValue: null,
      afterValue: newAssignment.title,
      editorName: editorName.trim(),
      editorEmail: editorEmail ? editorEmail.trim() : null,
      timestamp: new Date().toISOString(),
      reverted: false,
    });

    this.saveData(data);
    return newAssignment;
  }

  async updateAssignment(
    id: string,
    input: UpdateAssignmentInput,
    editorName: string,
    editorEmail?: string
  ): Promise<Assignment> {
    const data = this.loadData();
    const index = data.assignments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Assignment with ID ${id} not found`);
    }

    const current = data.assignments[index];
    const today = getToday();
    const nowIso = new Date().toISOString();

    // Track field edits in history
    const fieldsToCheck: (keyof UpdateAssignmentInput)[] = [
      'title',
      'dueDate',
      'notes',
      'subjectId',
    ];

    for (const field of fieldsToCheck) {
      if (input[field] !== undefined) {
        const before = (current[field as keyof Assignment] ?? null) as string | null;
        const rawAfter = input[field];
        const after =
          typeof rawAfter === 'string'
            ? field === 'dueDate'
              ? rawAfter
              : rawAfter.trim()
            : null;

        if (before !== after) {
          data.history.unshift({
            id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            classId: current.classId,
            assignmentId: current.id,
            assignmentTitle: input.title?.trim() || current.title,
            field,
            beforeValue: before,
            afterValue: after,
            editorName: editorName.trim(),
            editorEmail: editorEmail ? editorEmail.trim() : null,
            timestamp: nowIso,
            reverted: false,
          });
        }
      }
    }

    const updated: Assignment = {
      ...current,
      title: input.title !== undefined ? input.title.trim() : current.title,
      dueDate: input.dueDate !== undefined ? input.dueDate : current.dueDate,
      notes: input.notes !== undefined ? input.notes?.trim() || null : current.notes,
      subjectId: input.subjectId !== undefined ? input.subjectId : current.subjectId,
      updatedAt: today,
    };

    data.assignments[index] = updated;
    this.saveData(data);
    return updated;
  }

  async toggleAssignmentComplete(
    id: string,
    completed: boolean,
    editorName: string,
    editorEmail?: string
  ): Promise<Assignment> {
    const data = this.loadData();
    const index = data.assignments.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Assignment with ID ${id} not found`);
    }

    const current = data.assignments[index];
    if (current.completed === completed) {
      return current;
    }

    const today = getToday();
    const updated: Assignment = {
      ...current,
      completed,
      updatedAt: today,
    };

    data.assignments[index] = updated;

    data.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      classId: current.classId,
      assignmentId: current.id,
      assignmentTitle: current.title,
      field: 'completed',
      beforeValue: String(current.completed),
      afterValue: String(completed),
      editorName: editorName.trim(),
      editorEmail: editorEmail ? editorEmail.trim() : null,
      timestamp: new Date().toISOString(),
      reverted: false,
    });

    this.saveData(data);
    return updated;
  }

  async getHistory(classId: string): Promise<EditHistoryEntry[]> {
    const data = this.loadData();
    return data.history.filter((h) => h.classId === classId);
  }

  async revertEdit(
    historyId: string,
    editorName: string,
    editorEmail?: string
  ): Promise<void> {
    const data = this.loadData();
    const histIndex = data.history.findIndex((h) => h.id === historyId);
    if (histIndex === -1) {
      throw new Error(`Edit history record ${historyId} not found`);
    }

    const entry = data.history[histIndex];
    if (entry.reverted) {
      throw new Error(`Edit ${historyId} has already been reverted`);
    }

    const targetSubjectId = entry.subjectId || entry.assignmentId;
    const isSubject =
      entry.entityType === 'subject' ||
      entry.field === 'name' ||
      entry.field === 'teacherName' ||
      entry.field === 'createdSubject' ||
      entry.field === 'deletedSubject' ||
      Boolean(entry.metadata?.deletedSubject) ||
      (!data.assignments.some((a) => a.id === entry.assignmentId) &&
        data.subjects.some((s) => s.id === targetSubjectId));

    if (isSubject) {
      const subIndex = data.subjects.findIndex((s) => s.id === targetSubjectId);

      if (entry.field === 'created' || entry.field === 'createdSubject') {
        if (subIndex !== -1) {
          data.subjects.splice(subIndex, 1);
          data.assignments = data.assignments.filter((a) => a.subjectId !== targetSubjectId);
        }
      } else if (entry.field === 'name') {
        if (subIndex !== -1 && entry.beforeValue) {
          data.subjects[subIndex].name = entry.beforeValue;
        }
      } else if (entry.field === 'teacherName') {
        if (subIndex !== -1 && entry.beforeValue) {
          data.subjects[subIndex].teacherName = entry.beforeValue;
        }
      } else if (entry.field === 'deleted' || entry.field === 'deletedSubject') {
        if (entry.metadata?.deletedSubject) {
          const restoredSubject = entry.metadata.deletedSubject as Subject;
          if (!data.subjects.some((s) => s.id === restoredSubject.id)) {
            data.subjects.push(restoredSubject);
          }
          if (Array.isArray(entry.metadata.deletedAssignments)) {
            for (const asg of entry.metadata.deletedAssignments as Assignment[]) {
              if (!data.assignments.some((a) => a.id === asg.id)) {
                data.assignments.push(asg);
              }
            }
          }
        } else {
          // Fallback if metadata is not present
          if (!data.subjects.some((s) => s.id === targetSubjectId)) {
            data.subjects.push({
              id: targetSubjectId,
              classId: entry.classId,
              name: entry.assignmentTitle,
              teacherName: 'Teacher',
              createdAt: getToday(),
            });
          }
        }
      }
    } else {
      // Apply revert to assignment if field was a modified property
      const asgIndex = data.assignments.findIndex((a) => a.id === entry.assignmentId);
      if (asgIndex !== -1) {
        const asg = data.assignments[asgIndex];
        const today = getToday();

        if (entry.field === 'title') {
          asg.title = entry.beforeValue || 'Untitled Assignment';
        } else if (entry.field === 'dueDate') {
          asg.dueDate = entry.beforeValue;
        } else if (entry.field === 'notes') {
          asg.notes = entry.beforeValue;
        } else if (entry.field === 'subjectId') {
          if (entry.beforeValue) asg.subjectId = entry.beforeValue;
        } else if (entry.field === 'completed') {
          asg.completed = entry.beforeValue === 'true';
        } else if (entry.field === 'created') {
          // If created is reverted, remove the assignment
          data.assignments.splice(asgIndex, 1);
        }

        if (entry.field !== 'created') {
          asg.updatedAt = today;
        }
      }
    }

    // Mark edit record as reverted
    const nowIso = new Date().toISOString();
    const revertedByAttribution = editorEmail
      ? `${editorName.trim()} (${editorEmail.trim()})`
      : editorName.trim();

    data.history[histIndex] = {
      ...entry,
      reverted: true,
      revertedBy: revertedByAttribution,
      revertedAt: nowIso,
    };

    // Attribute the revert action in history
    data.history.unshift({
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      classId: entry.classId,
      assignmentId: entry.assignmentId,
      assignmentTitle: entry.assignmentTitle,
      field: `reverted (${entry.field})`,
      beforeValue: entry.afterValue,
      afterValue: entry.beforeValue,
      editorName: editorName.trim(),
      editorEmail: editorEmail ? editorEmail.trim() : null,
      timestamp: nowIso,
      reverted: false,
      entityType: entry.entityType,
      subjectId: entry.subjectId,
    });

    this.saveData(data);
  }
}
