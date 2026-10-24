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

  private async resolveValidClassId(classId: string): Promise<string> {
    const trimmed = classId.trim();

    // 1. Direct lookup by ID
    const { data: direct } = await this.client
      .from('classes')
      .select('id')
      .eq('id', trimmed)
      .maybeSingle();

    if (direct?.id) {
      return direct.id;
    }

    // 2. Lookup by code in case a class code string was passed
    const { data: byCode } = await this.client
      .from('classes')
      .select('id')
      .ilike('code', trimmed)
      .maybeSingle();

    if (byCode?.id) {
      return byCode.id;
    }

    // 3. Fallback to demo class ACED2026
    const { data: demo } = await this.client
      .from('classes')
      .select('id')
      .ilike('code', 'ACED2026')
      .maybeSingle();

    if (demo?.id) {
      return demo.id;
    }

    // 4. Auto-seed demo class if classes table is empty
    const { data: created, error } = await this.client
      .from('classes')
      .insert({
        code: 'ACED2026',
        name: 'Class of 2026 — Period 3',
        leader_email: 'leader@aced.school',
      })
      .select('id')
      .maybeSingle();

    if (!error && created?.id) {
      return created.id;
    }

    return trimmed;
  }

  async getClassByCode(code: string): Promise<Class | null> {
    const trimmed = code.trim();
    const { data, error } = await this.client
      .from('classes')
      .select('*')
      .ilike('code', trimmed)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        code: data.code,
        name: data.name,
        leaderEmail: data.leader_email || 'leader@aced.school',
        createdAt: data.created_at,
      };
    }

    // If code is demo class ACED2026 and not found, auto-seed it
    if (trimmed.toUpperCase() === 'ACED2026') {
      const { data: inserted, error: insertErr } = await this.client
        .from('classes')
        .insert({
          code: 'ACED2026',
          name: 'Class of 2026 — Period 3',
          leader_email: 'leader@aced.school',
        })
        .select()
        .maybeSingle();

      if (!insertErr && inserted) {
        return {
          id: inserted.id,
          code: inserted.code,
          name: inserted.name,
          leaderEmail: inserted.leader_email || 'leader@aced.school',
          createdAt: inserted.created_at,
        };
      }
    }

    return null;
  }

  async getClassById(id: string): Promise<Class | null> {
    const { data, error } = await this.client
      .from('classes')
      .select('*')
      .eq('id', id.trim())
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      leaderEmail: data.leader_email || 'leader@aced.school',
      createdAt: data.created_at,
    };
  }

  async createClass(
    name: string,
    leaderEmail: string,
    customCode?: string
  ): Promise<Class> {
    const trimmedName = name.trim();
    const trimmedEmail = leaderEmail.trim().toLowerCase();

    let code = customCode?.trim().toUpperCase() || '';
    if (!code) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      code = `ACED-${randPart}`;
    }

    const { data, error } = await this.client
      .from('classes')
      .insert({
        code,
        name: trimmedName,
        leader_email: trimmedEmail,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create class: ${error?.message}`);
    }

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      leaderEmail: data.leader_email,
      createdAt: data.created_at,
    };
  }

  async updateClassLeader(
    classId: string,
    newLeaderEmail: string
  ): Promise<Class> {
    const validId = await this.resolveValidClassId(classId);
    const trimmedEmail = newLeaderEmail.trim().toLowerCase();

    const { data, error } = await this.client
      .from('classes')
      .update({
        leader_email: trimmedEmail,
      })
      .eq('id', validId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to transfer leadership: ${error?.message}`);
    }

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      leaderEmail: data.leader_email,
      createdAt: data.created_at,
    };
  }

  async getSubjects(classId: string): Promise<Subject[]> {
    const validId = await this.resolveValidClassId(classId);
    const { data, error } = await this.client
      .from('subjects')
      .select('*')
      .eq('class_id', validId)
      .order('name');

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      classId: row.class_id,
      name: row.name,
      teacherName: row.teacher_name,
      createdAt: row.created_at,
    }));
  }

  async createSubject(
    classId: string,
    input: CreateSubjectInput,
    editorName?: string,
    editorEmail?: string
  ): Promise<Subject> {
    const validId = await this.resolveValidClassId(classId);
    const { data, error } = await this.client
      .from('subjects')
      .insert({
        class_id: validId,
        name: input.name.trim(),
        teacher_name: input.teacherName.trim(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create subject: ${error?.message}`);
    }

    const created: Subject = {
      id: data.id,
      classId: data.class_id,
      name: data.name,
      teacherName: data.teacher_name,
      createdAt: data.created_at,
    };

    // Insert history record
    await this.client.from('edit_history').insert({
      class_id: validId,
      assignment_id: null,
      assignment_title: created.name,
      field: 'created',
      before_value: null,
      after_value: `${created.name} (${created.teacherName})`,
      editor_name: (editorName || 'Student').trim(),
      editor_email: editorEmail ? editorEmail.trim() : null,
    });

    return created;
  }

  async updateSubject(
    id: string,
    input: UpdateSubjectInput,
    editorName?: string,
    editorEmail?: string
  ): Promise<Subject> {
    // Fetch current subject for history diff
    const { data: current } = await this.client
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single();

    const updates: Record<string, unknown> = {};
    if (input.name !== undefined) updates.name = input.name.trim();
    if (input.teacherName !== undefined)
      updates.teacher_name = input.teacherName.trim();

    const { data, error } = await this.client
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update subject: ${error?.message}`);
    }

    const updated: Subject = {
      id: data.id,
      classId: data.class_id,
      name: data.name,
      teacherName: data.teacher_name,
      createdAt: data.created_at,
    };

    if (current) {
      const editor = (editorName || 'Student').trim();
      const email = editorEmail ? editorEmail.trim() : null;

      if (input.name !== undefined && current.name !== input.name.trim()) {
        await this.client.from('edit_history').insert({
          class_id: current.class_id,
          assignment_id: null,
          assignment_title: input.name.trim(),
          field: 'name',
          before_value: current.name,
          after_value: input.name.trim(),
          editor_name: editor,
          editor_email: email,
        });
      }

      if (
        input.teacherName !== undefined &&
        current.teacher_name !== input.teacherName.trim()
      ) {
        await this.client.from('edit_history').insert({
          class_id: current.class_id,
          assignment_id: null,
          assignment_title: updates.name ? String(updates.name) : current.name,
          field: 'teacherName',
          before_value: current.teacher_name,
          after_value: input.teacherName.trim(),
          editor_name: editor,
          editor_email: email,
        });
      }
    }

    return updated;
  }

  async deleteSubject(
    id: string,
    editorName?: string,
    editorEmail?: string
  ): Promise<void> {
    const { data: current } = await this.client
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single();

    if (current) {
      await this.client.from('edit_history').insert({
        class_id: current.class_id,
        assignment_id: null,
        assignment_title: current.name,
        field: 'deleted',
        before_value: `${current.name} (${current.teacher_name})`,
        after_value: null,
        editor_name: (editorName || 'Student').trim(),
        editor_email: editorEmail ? editorEmail.trim() : null,
      });
    }

    // 1. Find all assignments for this subject so we can remove associated edit history
    const { data: asgs } = await this.client
      .from('assignments')
      .select('id')
      .eq('subject_id', id);

    if (asgs && asgs.length > 0) {
      const asgIds = asgs.map((a) => a.id);
      await this.client
        .from('edit_history')
        .delete()
        .in('assignment_id', asgIds);

      await this.client
        .from('assignments')
        .delete()
        .eq('subject_id', id);
    }

    // 2. Delete the subject itself
    const { error } = await this.client
      .from('subjects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete subject: ${error.message}`);
    }
  }

  async getAssignments(classId: string): Promise<Assignment[]> {
    const validId = await this.resolveValidClassId(classId);
    const { data, error } = await this.client
      .from('assignments')
      .select('*')
      .eq('class_id', validId)
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
    editorName: string,
    editorEmail?: string
  ): Promise<Assignment> {
    const validId = await this.resolveValidClassId(classId);
    const { data, error } = await this.client
      .from('assignments')
      .insert({
        class_id: validId,
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
      class_id: validId,
      assignment_id: data.id,
      assignment_title: data.title,
      field: 'created',
      before_value: null,
      after_value: data.title,
      editor_name: editorName.trim(),
      editor_email: editorEmail ? editorEmail.trim() : null,
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
    editorName: string,
    editorEmail?: string
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
            editor_email: editorEmail ? editorEmail.trim() : null,
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
    editorName: string,
    editorEmail?: string
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
      editor_email: editorEmail ? editorEmail.trim() : null,
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
    const validId = await this.resolveValidClassId(classId);
    const { data, error } = await this.client
      .from('edit_history')
      .select('*')
      .eq('class_id', validId)
      .order('timestamp', { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      classId: row.class_id,
      assignmentId: row.assignment_id || row.subject_id || '',
      assignmentTitle: row.assignment_title,
      field: row.field,
      beforeValue: row.before_value,
      afterValue: row.after_value,
      editorName: row.editor_name,
      editorEmail: row.editor_email,
      timestamp: row.timestamp,
      reverted: row.reverted,
      revertedBy: row.reverted_by,
      revertedAt: row.reverted_at,
      entityType: row.assignment_id ? 'assignment' : 'subject',
      subjectId: row.assignment_id ? null : row.subject_id || null,
    }));
  }

  async revertEdit(
    historyId: string,
    editorName: string,
    editorEmail?: string
  ): Promise<void> {
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

    const isSubject =
      !entry.assignment_id || ['name', 'teacherName'].includes(entry.field);

    if (isSubject) {
      if (entry.field === 'name') {
        await this.client
          .from('subjects')
          .update({ name: entry.before_value })
          .eq('name', entry.after_value);
      } else if (entry.field === 'teacherName') {
        await this.client
          .from('subjects')
          .update({ teacher_name: entry.before_value })
          .eq('name', entry.assignment_title);
      } else if (entry.field === 'created') {
        await this.client
          .from('subjects')
          .delete()
          .eq('name', entry.assignment_title);
      } else if (entry.field === 'deleted') {
        await this.client.from('subjects').insert({
          class_id: entry.class_id,
          name: entry.assignment_title,
          teacher_name: 'Teacher',
        });
      }
    } else {
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
    }

    const nowIso = new Date().toISOString();
    const revertedByAttribution = editorEmail
      ? `${editorName.trim()} (${editorEmail.trim()})`
      : editorName.trim();

    // Mark edit record as reverted
    await this.client
      .from('edit_history')
      .update({
        reverted: true,
        reverted_by: revertedByAttribution,
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
      editor_email: editorEmail ? editorEmail.trim() : null,
    });
  }
}
