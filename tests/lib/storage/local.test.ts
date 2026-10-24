import { describe, it, expect, beforeEach } from 'vitest';
import { LocalRepository } from '@/lib/storage/local';
import { setToday, getToday } from '@/lib/date';

describe('LocalRepository', () => {
  let repo: LocalRepository;

  beforeEach(() => {
    localStorage.clear();
    setToday('2026-10-10');
    repo = new LocalRepository('test.aced.db.v1');
  });

  it('initializes with seed data matching specification', async () => {
    const cls = await repo.getClassByCode('ACED2026');
    expect(cls).not.toBeNull();
    expect(cls?.name).toBe('Class of 2026 — Period 3');

    const subjects = await repo.getSubjects(cls!.id);
    expect(subjects).toHaveLength(6);
    expect(subjects[0].name).toBe('AP Calculus BC');
    expect(subjects[0].teacherName).toBe('Mr. Harrison');

    const assignments = await repo.getAssignments(cls!.id);
    expect(assignments.length).toBeGreaterThanOrEqual(9);

    const noDate = assignments.filter((a) => !a.dueDate && !a.completed);
    expect(noDate.length).toBeGreaterThanOrEqual(4);

    const overdue = assignments.filter(
      (a) => a.dueDate && a.dueDate < getToday() && !a.completed
    );
    expect(overdue.length).toBeGreaterThanOrEqual(3);

    const todayOrTomorrow = assignments.filter((a) => {
      if (!a.dueDate || a.completed) return false;
      return a.dueDate === '2026-10-10' || a.dueDate === '2026-10-11';
    });
    expect(todayOrTomorrow.length).toBeGreaterThanOrEqual(2);

    const done = assignments.filter((a) => a.completed);
    expect(done.length).toBeGreaterThanOrEqual(1);

    const history = await repo.getHistory(cls!.id);
    expect(history.length).toBeGreaterThanOrEqual(3);
  });

  it('creates, updates, and completes assignments while tracking history', async () => {
    const cls = await repo.getClassByCode('ACED2026');
    const subjects = await repo.getSubjects(cls!.id);
    const subId = subjects[0].id;

    // Create
    const created = await repo.createAssignment(
      cls!.id,
      {
        subjectId: subId,
        title: 'New Physics Lab',
        dueDate: '2026-10-12',
        notes: 'Bring safety goggles',
      },
      'Alice'
    );
    expect(created.title).toBe('New Physics Lab');

    // Update
    const updated = await repo.updateAssignment(
      created.id,
      {
        title: 'Updated Physics Lab',
        dueDate: '2026-10-14',
      },
      'Bob'
    );
    expect(updated.title).toBe('Updated Physics Lab');
    expect(updated.dueDate).toBe('2026-10-14');

    // Toggle Complete
    const completed = await repo.toggleAssignmentComplete(
      created.id,
      true,
      'Charlie'
    );
    expect(completed.completed).toBe(true);

    const history = await repo.getHistory(cls!.id);
    expect(history[0].field).toBe('completed');
    expect(history[0].afterValue).toBe('true');
  });

  it('supports one-tap revert of an edit', async () => {
    const cls = await repo.getClassByCode('ACED2026');
    const historyBefore = await repo.getHistory(cls!.id);
    const targetEdit = historyBefore.find((h) => !h.reverted && h.field === 'notes');
    expect(targetEdit).toBeDefined();

    await repo.revertEdit(targetEdit!.id, 'Undoer Student');

    const assignments = await repo.getAssignments(cls!.id);
    const asg = assignments.find((a) => a.id === targetEdit!.assignmentId);
    expect(asg?.notes).toBe(targetEdit!.beforeValue);

    const historyAfter = await repo.getHistory(cls!.id);
    const revertedRecord = historyAfter.find((h) => h.id === targetEdit!.id);
    expect(revertedRecord?.reverted).toBe(true);
    expect(revertedRecord?.revertedBy).toBe('Undoer Student');
  });

  it('supports creating a new class and updating class leader', async () => {
    const newClass = await repo.createClass('Class of 2027', 'founder@school.edu');
    expect(newClass.id).toBeDefined();
    expect(newClass.name).toBe('Class of 2027');
    expect(newClass.leaderEmail).toBe('founder@school.edu');
    expect(newClass.code).toMatch(/^ACED-[A-Z0-9]{4}$/);

    const retrieved = await repo.getClassByCode(newClass.code);
    expect(retrieved?.id).toBe(newClass.id);

    const updated = await repo.updateClassLeader(newClass.id, 'newleader@school.edu');
    expect(updated.leaderEmail).toBe('newleader@school.edu');
  });

  it('tracks history and supports rollback for subject creation, edit, and deletion', async () => {
    const cls = await repo.getClassByCode('ACED2026');
    const classId = cls!.id;

    // 1. Create a subject
    const subject = await repo.createSubject(
      classId,
      { name: 'Philosophy', teacherName: 'Prof. Socrates' },
      'Plato',
      'plato@aced.school'
    );
    expect(subject.name).toBe('Philosophy');

    let history = await repo.getHistory(classId);
    const createEntry = history[0];
    expect(createEntry.field).toBe('created');
    expect(createEntry.entityType).toBe('subject');
    expect(createEntry.assignmentTitle).toBe('Philosophy');
    expect(createEntry.editorName).toBe('Plato');
    expect(createEntry.editorEmail).toBe('plato@aced.school');

    // Also add an assignment to this subject
    const asg = await repo.createAssignment(
      classId,
      {
        subjectId: subject.id,
        title: 'The Republic Reading',
        dueDate: '2026-10-25',
      },
      'Plato'
    );

    // 2. Edit subject name and teacherName
    const editedSubject = await repo.updateSubject(
      subject.id,
      { name: 'Ancient Philosophy', teacherName: 'Prof. Aristotle' },
      'Xenophon',
      'xenophon@aced.school'
    );
    expect(editedSubject.name).toBe('Ancient Philosophy');
    expect(editedSubject.teacherName).toBe('Prof. Aristotle');

    history = await repo.getHistory(classId);
    const teacherEditEntry = history.find(
      (h) => h.subjectId === subject.id && h.field === 'teacherName'
    );
    const nameEditEntry = history.find(
      (h) => h.subjectId === subject.id && h.field === 'name'
    );
    expect(teacherEditEntry).toBeDefined();
    expect(teacherEditEntry?.beforeValue).toBe('Prof. Socrates');
    expect(teacherEditEntry?.afterValue).toBe('Prof. Aristotle');

    expect(nameEditEntry).toBeDefined();
    expect(nameEditEntry?.beforeValue).toBe('Philosophy');
    expect(nameEditEntry?.afterValue).toBe('Ancient Philosophy');

    // Rollback teacher edit
    await repo.revertEdit(teacherEditEntry!.id, 'Leader Jamie', 'leader@aced.school');
    let subjects = await repo.getSubjects(classId);
    let currentSub = subjects.find((s) => s.id === subject.id);
    expect(currentSub?.teacherName).toBe('Prof. Socrates');

    // 3. Delete subject (which also removes associated assignments)
    await repo.deleteSubject(subject.id, 'Alexander', 'alexander@aced.school');
    subjects = await repo.getSubjects(classId);
    expect(subjects.some((s) => s.id === subject.id)).toBe(false);
    let asgs = await repo.getAssignments(classId);
    expect(asgs.some((a) => a.id === asg.id)).toBe(false);

    history = await repo.getHistory(classId);
    const deleteEntry = history.find(
      (h) => h.subjectId === subject.id && h.field === 'deleted'
    );
    expect(deleteEntry).toBeDefined();
    expect(deleteEntry?.assignmentTitle).toBe('Ancient Philosophy');
    expect(deleteEntry?.editorName).toBe('Alexander');

    // 4. Rollback deletion: restores both the subject and its assignments!
    await repo.revertEdit(deleteEntry!.id, 'Leader Jamie', 'leader@aced.school');
    subjects = await repo.getSubjects(classId);
    const restoredSub = subjects.find((s) => s.id === subject.id);
    expect(restoredSub).toBeDefined();
    expect(restoredSub?.name).toBe('Ancient Philosophy');

    asgs = await repo.getAssignments(classId);
    const restoredAsg = asgs.find((a) => a.id === asg.id);
    expect(restoredAsg).toBeDefined();
    expect(restoredAsg?.title).toBe('The Republic Reading');

    // 5. Rollback subject creation: deletes the subject
    await repo.revertEdit(createEntry.id, 'Leader Jamie', 'leader@aced.school');
    subjects = await repo.getSubjects(classId);
    expect(subjects.some((s) => s.id === subject.id)).toBe(false);
  });
});
