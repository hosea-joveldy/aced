import { createClient, type SupabaseClient } from '@supabase/supabase-js';
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

export class SupabaseRepository implements AcedRepository {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  async getClassByCode(code: string): Promise<Class | null> {
    const { data, error } = await this.client
      .from('classes')
      .select('*')
      .ilike('code', code.trim())
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      createdAt: data.created_at,
    };
  }

  async getClassById(id: string): Promise<Class | null> {
    const { data, error } = await this.client
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      createdAt: data.created_at,
    };
  }

  async getSubjects(classId: string): Promise<Subject[]> {
    const { data, error } = await this.client
      .from('subjects')
      .select('*')
      .eq('class_id', classId)
      .order('name');

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      classId: row.class_id,
      name: row.name,
      teacherName: row.teacher_name,
      classroomCode: row.classroom_code,
      createdAt: row.created_at,
    }));
  }

  async createSubject(
    classId: string,
    input: CreateSubjectInput
  ): Promise<Subject> {
    const { data, error } = await this.client
      .from('subjects')
      .insert({
        class_id: classId,
        name: input.name.trim(),
        teacher_name: input.teacherName.trim(),
        classroom_code: input.classroomCode?.trim() || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create subject: ${error?.message}`);
    }

    return {
      id: data.id,
      classId: data.class_id,
      name: data.name,
      teacherName: data.teacher_name,
      classroomCode: data.classroom_code,
      createdAt: data.created_at,
    };
  }

  async updateSubject(
    id: string,
    input: UpdateSubjectInput
  ): Promise<Subject> {
    const updates: Record<string, unknown> = {};
    if (input.name !== undefined) updates.name = input.name.trim();
    if (input.teacherName !== undefined)
      updates.teacher_name = input.teacherName.trim();
    if (input.classroomCode !== undefined)
      updates.classroom_code = input.classroomCode?.trim() || null;

    const { data, error } = await this.client
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update subject: ${error?.message}`);
    }

    return {
      id: data.id,
      classId: data.class_id,
      name: data.name,
      teacherName: data.teacher_name,
      classroomCode: data.classroom_code,
      createdAt: data.created_at,
    };
  }

  async getAssignments(classId: string): Promise<Assignment[]> {
    const { data, error } = await this.client
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      classId: row.class_id,
      subjectId: row.subject_id,
      title: row.title,
      dueDate: row.due_date,
      notes: row.notes,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async createAssignment(
    classId: string,
    input: CreateAssignmentInput,
    editorName: string
  ): Promise<Assignment> {
    const { data, error } = await this.client
      .from('assignments')
      .insert({
        class_id: classId,
        subject_id: input.subjectId,
        title: input.title.trim(),
        due_date: input.dueDate || null,
        notes: input.notes?.trim() || null,
        completed: false,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create assignment: ${error?.message}`);
    }

    // Insert history record
    await this.client.from('edit_history').insert({
      class_id: classId,
      assignment_id: data.id,
      assignment_title: data.title,
      field: 'created',
      before_value: null,
      after_value: data.title,
      editor_name: editorName.trim(),
    });

    return {
      id: data.id,
      classId: data.class_id,
      subjectId: data.subject_id,
      title: data.title,
      dueDate: data.due_date,
      notes: data.notes,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateAssignment(
    id: string,
    input: UpdateAssignmentInput,
    editorName: string
  ): Promise<Assignment> {
    // Fetch current assignment for history diff
    const { data: current } = await this.client
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (!current) {
      throw new Error(`Assignment with ID ${id} not found`);
    }

    const updates: Record<string, unknown> = {};
    if (input.title !== undefined) updates.title = input.title.trim();
    if (input.dueDate !== undefined) updates.due_date = input.dueDate;
    if (input.notes !== undefined) updates.notes = input.notes?.trim() || null;
    if (input.subjectId !== undefined) updates.subject_id = input.subjectId;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await this.client
      .from('assignments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update assignment: ${error?.message}`);
    }

    // Diff fields and log edit history
    const fieldsToCheck: (keyof UpdateAssignmentInput)[] = [
      'title',
      'dueDate',
      'notes',
      'subjectId',
    ];

    for (const field of fieldsToCheck) {
      if (input[field] !== undefined) {
        const dbCol = field === 'dueDate' ? 'due_date' : field === 'subjectId' ? 'subject_id' : field;
        const before = current[dbCol] ? String(current[dbCol]) : null;
        const after = input[field] ? String(input[field]) : null;

        if (before !== after) {
          await this.client.from('edit_history').insert({
            class_id: current.class_id,
            assignment_id: current.id,
            assignment_title: updates.title ? String(updates.title) : current.title,
            field,
            before_value: before,
            after_value: after,
            editor_name: editorName.trim(),
          });
        }
      }
    }

    return {
      id: data.id,
      classId: data.class_id,
      subjectId: data.subject_id,
      title: data.title,
      dueDate: data.due_date,
      notes: data.notes,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async toggleAssignmentComplete(
    id: string,
    completed: boolean,
    editorName: string
  ): Promise<Assignment> {
    const { data: current } = await this.client
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (!current) {
      throw new Error(`Assignment with ID ${id} not found`);
    }

    const { data, error } = await this.client
      .from('assignments')
      .update({
        completed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to toggle assignment completion: ${error?.message}`);
    }

    await this.client.from('edit_history').insert({
      class_id: current.class_id,
      assignment_id: current.id,
      assignment_title: current.title,
      field: 'completed',
      before_value: String(current.completed),
      after_value: String(completed),
      editor_name: editorName.trim(),
    });

    return {
      id: data.id,
      classId: data.class_id,
      subjectId: data.subject_id,
      title: data.title,
      dueDate: data.due_date,
      notes: data.notes,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getHistory(classId: string): Promise<EditHistoryEntry[]> {
    const { data, error } = await this.client
      .from('edit_history')
      .select('*')
      .eq('class_id', classId)
      .order('timestamp', { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      classId: row.class_id,
      assignmentId: row.assignment_id,
      assignmentTitle: row.assignment_title,
      field: row.field,
      beforeValue: row.before_value,
      afterValue: row.after_value,
      editorName: row.editor_name,
      timestamp: row.timestamp,
      reverted: row.reverted,
      revertedBy: row.reverted_by,
      revertedAt: row.reverted_at,
    }));
  }

  async revertEdit(historyId: string, editorName: string): Promise<void> {
    const { data: entry } = await this.client
      .from('edit_history')
      .select('*')
      .eq('id', historyId)
      .single();

    if (!entry) {
      throw new Error(`Edit history record ${historyId} not found`);
    }

    if (entry.reverted) {
      throw new Error(`Edit ${historyId} has already been reverted`);
    }

    // Apply reverted before_value to assignment
    const asgUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (entry.field === 'title') {
      asgUpdates.title = entry.before_value || 'Untitled Assignment';
    } else if (entry.field === 'dueDate') {
      asgUpdates.due_date = entry.before_value;
    } else if (entry.field === 'notes') {
      asgUpdates.notes = entry.before_value;
    } else if (entry.field === 'subjectId') {
      if (entry.before_value) asgUpdates.subject_id = entry.before_value;
    } else if (entry.field === 'completed') {
      asgUpdates.completed = entry.before_value === 'true';
    }

    if (entry.field !== 'created') {
      await this.client
        .from('assignments')
        .update(asgUpdates)
        .eq('id', entry.assignment_id);
    } else {
      await this.client
        .from('assignments')
        .delete()
        .eq('id', entry.assignment_id);
    }

    const nowIso = new Date().toISOString();

    // Mark edit record as reverted
    await this.client
      .from('edit_history')
      .update({
        reverted: true,
        reverted_by: editorName.trim(),
        reverted_at: nowIso,
      })
      .eq('id', historyId);

    // Insert attributed revert entry
    await this.client.from('edit_history').insert({
      class_id: entry.class_id,
      assignment_id: entry.assignment_id,
      assignment_title: entry.assignment_title,
      field: `reverted (${entry.field})`,
      before_value: entry.after_value,
      after_value: entry.before_value,
      editor_name: editorName.trim(),
    });
  }
}
