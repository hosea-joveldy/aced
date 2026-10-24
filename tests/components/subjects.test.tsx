import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { RepositoryProvider } from '@/context/RepositoryContext';
import { SessionProvider } from '@/context/SessionContext';
import { SubjectsScreen } from '@/screens/SubjectsScreen';
import { LocalRepository } from '@/lib/storage/local';

describe('SubjectsScreen Component', () => {
  let repo: LocalRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalRepository('test.subjects.db');
    // Seed session
    localStorage.setItem(
      'aced.session.v1',
      JSON.stringify({
        displayName: 'Test Student',
        classCode: 'ACED2026',
        classId: 'class-aced-2026',
        className: 'Class of 2026 — Period 3',
      })
    );
  });

  const renderScreen = () =>
    render(
      <RepositoryProvider repository={repo}>
        <SessionProvider>
          <SubjectsScreen />
        </SessionProvider>
      </RepositoryProvider>
    );

  it('renders all 6 initial seed subjects with teachers', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('AP Calculus BC')).toBeInTheDocument();
    });

    expect(screen.getByText('Mr. Harrison')).toBeInTheDocument();
    expect(screen.getByText('AP Chemistry')).toBeInTheDocument();
    expect(screen.getByText('Dr. Chen')).toBeInTheDocument();
  });

  it('validates required fields when adding a subject', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('AP Calculus BC')).toBeInTheDocument();
    });

    // Open Add Modal
    fireEvent.click(screen.getByRole('button', { name: /add subject/i }));

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /add new subject/i })
    ).toBeInTheDocument();

    // Click submit empty inside dialog
    fireEvent.click(
      within(dialog).getByRole('button', { name: /add subject/i })
    );

    expect(
      await within(dialog).findByText(/subject name is required/i)
    ).toBeInTheDocument();
  });

  it('successfully creates a new subject and displays it', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('AP Calculus BC')).toBeInTheDocument();
    });

    // Open Add Modal
    fireEvent.click(screen.getByRole('button', { name: /add subject/i }));

    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/subject name \*/i), {
      target: { value: 'World Mythology' },
    });
    fireEvent.change(within(dialog).getByLabelText(/teacher name \*/i), {
      target: { value: 'Ms. Thorne' },
    });

    // Click submit in dialog
    fireEvent.click(
      within(dialog).getByRole('button', { name: /add subject/i })
    );

    await waitFor(() => {
      expect(screen.getByText('World Mythology')).toBeInTheDocument();
      expect(screen.getByText('Ms. Thorne')).toBeInTheDocument();
    });

    // Subject is created cleanly without synthetic "Coursework #1 / #2" placeholder assignments
    expect(screen.queryByText('Coursework #1: Reading & Reflection')).not.toBeInTheDocument();
  });

  it('shows all assignments for subjects even when there are no deadlines, and lets students assign a deadline', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('AP Calculus BC')).toBeInTheDocument();
    });

    const calcClassroomSection = screen.getByTestId('classroom-assignments-sub-calc');
    // Shows dated and undated assignments for AP Calculus BC
    expect(within(calcClassroomSection).getByText('Calculus Problem Set 4')).toBeInTheDocument();
    expect(within(calcClassroomSection).getByText('Integral Applications Worksheet')).toBeInTheDocument();
    expect(within(calcClassroomSection).getByText(/no deadline set/i)).toBeInTheDocument();

    // Student assigns a deadline to the undated assignment
    fireEvent.click(
      within(calcClassroomSection).getByRole('button', {
        name: /assign deadline for integral applications worksheet/i,
      })
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/due date/i), {
      target: { value: '2026-10-20' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(within(calcClassroomSection).getByText(/Due 2026-10-20/i)).toBeInTheDocument();
    });
  });

  it('allows deleting a subject with confirmation', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('AP Calculus BC')).toBeInTheDocument();
    });

    // Click delete button on AP Calculus BC card
    const deleteButton = screen.getByRole('button', { name: /delete ap calculus bc/i });
    fireEvent.click(deleteButton);

    // Confirmation dialog appears
    const confirmDialog = screen.getByRole('dialog', { name: /delete subject\?/i });
    expect(confirmDialog).toBeInTheDocument();
    expect(within(confirmDialog).getByText(/are you sure you want to delete/i)).toBeInTheDocument();

    // Confirm delete
    fireEvent.click(within(confirmDialog).getByRole('button', { name: /^delete subject$/i }));

    // AP Calculus BC is removed from the view
    await waitFor(() => {
      expect(screen.queryByText('AP Calculus BC')).not.toBeInTheDocument();
    });

    // Verify it persists in storage and does not return upon reload/remount
    const updatedSubjects = await repo.getSubjects('class-aced-2026');
    expect(updatedSubjects.some((s) => s.name === 'AP Calculus BC')).toBe(false);

    // Verify deletion is recorded in history
    const history = await repo.getHistory('class-aced-2026');
    const deleteEntry = history.find(
      (h) => h.field === 'deleted' && h.assignmentTitle === 'AP Calculus BC'
    );
    expect(deleteEntry).toBeDefined();
    expect(deleteEntry?.editorName).toBe('Test Student');
  });

  it('records subject creation and edits to history with student attribution', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('AP Calculus BC')).toBeInTheDocument();
    });

    // 1. Add subject
    fireEvent.click(screen.getByRole('button', { name: /add subject/i }));
    let dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/subject name \*/i), {
      target: { value: 'Astrophysics' },
    });
    fireEvent.change(within(dialog).getByLabelText(/teacher name \*/i), {
      target: { value: 'Dr. Sagan' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /add subject/i }));

    await waitFor(() => {
      expect(screen.getByText('Astrophysics')).toBeInTheDocument();
    });

    let history = await repo.getHistory('class-aced-2026');
    const createEntry = history.find(
      (h) => h.field === 'created' && h.assignmentTitle === 'Astrophysics'
    );
    expect(createEntry).toBeDefined();
    expect(createEntry?.editorName).toBe('Test Student');
    expect(createEntry?.entityType).toBe('subject');

    // 2. Edit subject
    fireEvent.click(screen.getByRole('button', { name: /edit astrophysics/i }));
    dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/teacher name \*/i), {
      target: { value: 'Prof. Hawking' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText('Prof. Hawking')).toBeInTheDocument();
    });

    history = await repo.getHistory('class-aced-2026');
    const editEntry = history.find(
      (h) => h.field === 'teacherName' && h.assignmentTitle === 'Astrophysics'
    );
    expect(editEntry).toBeDefined();
    expect(editEntry?.beforeValue).toBe('Dr. Sagan');
    expect(editEntry?.afterValue).toBe('Prof. Hawking');
    expect(editEntry?.editorName).toBe('Test Student');
  });
});

