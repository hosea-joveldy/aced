import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { RepositoryProvider } from '@/context/RepositoryContext';
import { SessionProvider } from '@/context/SessionContext';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { LocalRepository } from '@/lib/storage/local';

describe('HistoryScreen Component', () => {
  let repo: LocalRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalRepository('test.history.db');
    localStorage.setItem(
      'aced.session.v1',
      JSON.stringify({
        displayName: 'Jamie Undoer',
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
          <HistoryScreen />
        </SessionProvider>
      </RepositoryProvider>
    );

  it('renders at least 3 pre-existing seed edits with attribution', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Edit History & Undo')).toBeInTheDocument();
      expect(screen.getByText(/Alex M\./i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Jordan K\./i)).toBeInTheDocument();
    expect(screen.getByText(/Taylor S\./i)).toBeInTheDocument();
  });

  it('shows view-only audit message for regular student and hides revert button', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Edit History & Undo')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/only the designated class leader can revert edits/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', {
        name: /revert edit on calculus problem set 4/i,
      })
    ).not.toBeInTheDocument();
  });

  it('allows designated class leader to open confirmation modal and revert an edit', async () => {
    localStorage.setItem(
      'aced.session.v1',
      JSON.stringify({
        email: 'leader@aced.school',
        displayName: 'Jamie Leader',
        classCode: 'ACED2026',
        classId: 'class-aced-2026',
        className: 'Class of 2026 — Period 3',
        isClassLeader: true,
      })
    );

    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Calculus Problem Set 4')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/class leader privileges/i)
    ).toBeInTheDocument();

    const revertBtn = screen.getByRole('button', {
      name: /revert edit on calculus problem set 4/i,
    });
    fireEvent.click(revertBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole('heading', { name: /confirm revert/i })
    ).toBeInTheDocument();

    // Confirm revert
    const confirmBtn = within(dialog).getByRole('button', {
      name: /yes, revert edit/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Check that a Reverted badge is now displayed
    expect(screen.getAllByText('Reverted').length).toBeGreaterThanOrEqual(1);
  });

  it('allows class leader to select multiple timestamps and batch revert them', async () => {
    localStorage.setItem(
      'aced.session.v1',
      JSON.stringify({
        email: 'leader@aced.school',
        displayName: 'Jamie Leader',
        classCode: 'ACED2026',
        classId: 'class-aced-2026',
        className: 'Class of 2026 — Period 3',
        isClassLeader: true,
      })
    );

    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Calculus Problem Set 4')).toBeInTheDocument();
    });

    // Check that select all is present
    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all revertible edits/i,
    });
    expect(selectAllCheckbox).toBeInTheDocument();

    // Select individual items by checking their checkboxes
    const itemCheckboxes = screen.getAllByRole('checkbox', {
      name: /select edit at/i,
    });
    expect(itemCheckboxes.length).toBeGreaterThanOrEqual(2);

    fireEvent.click(itemCheckboxes[0]);
    fireEvent.click(itemCheckboxes[1]);

    // Verify selected count badge and batch revert button appear
    expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
    const batchRevertBtn = screen.getByRole('button', {
      name: /revert selected \(2\)/i,
    });
    expect(batchRevertBtn).toBeInTheDocument();

    // Open batch revert modal
    fireEvent.click(batchRevertBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole('heading', { name: /confirm revert \(2 edits\)/i })
    ).toBeInTheDocument();

    // Confirm batch revert
    const confirmBtn = within(dialog).getByRole('button', {
      name: /yes, revert 2 edits/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Both should now be reverted
    expect(screen.getAllByText('Reverted').length).toBeGreaterThanOrEqual(2);
  });

  it('allows class leader to use select all and clear selection', async () => {
    localStorage.setItem(
      'aced.session.v1',
      JSON.stringify({
        email: 'leader@aced.school',
        displayName: 'Jamie Leader',
        classCode: 'ACED2026',
        classId: 'class-aced-2026',
        className: 'Class of 2026 — Period 3',
        isClassLeader: true,
      })
    );

    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Calculus Problem Set 4')).toBeInTheDocument();
    });

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all revertible edits/i,
    });

    // Click select all
    fireEvent.click(selectAllCheckbox);

    expect(screen.getByText(/3 selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /revert selected \(3\)/i })
    ).toBeInTheDocument();

    // Click clear selection
    const clearBtn = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearBtn);

    expect(screen.queryByText(/3 selected/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /revert selected/i })
    ).not.toBeInTheDocument();
  });

  it('displays subject history, filters by subjects, and allows class leader to revert subject changes', async () => {
    localStorage.setItem(
      'aced.session.v1',
      JSON.stringify({
        email: 'leader@aced.school',
        displayName: 'Jamie Leader',
        classCode: 'ACED2026',
        classId: 'class-aced-2026',
        className: 'Class of 2026 — Period 3',
        isClassLeader: true,
      })
    );

    // Create a subject and edit it
    const sub = await repo.createSubject(
      'class-aced-2026',
      { name: 'Philosophy', teacherName: 'Prof. Socrates' },
      'Student Plato',
      'plato@aced.school'
    );
    await repo.updateSubject(
      sub.id,
      { teacherName: 'Prof. Aristotle' },
      'Student Plato',
      'plato@aced.school'
    );

    renderScreen();

    await waitFor(() => {
      expect(screen.getAllByText('Philosophy').length).toBe(2);
      expect(screen.getByText('Created Subject')).toBeInTheDocument();
      expect(screen.getByText('Teacher Name')).toBeInTheDocument();
    });

    // Test "Subjects" filter chip
    const subjectsChip = screen.getByRole('button', { name: /^subjects$/i });
    fireEvent.click(subjectsChip);

    // Philosophy entries should be visible
    expect(screen.getAllByText('Philosophy').length).toBe(2);
    // Non-subject assignment entries should be filtered out
    expect(screen.queryByText('Calculus Problem Set 4')).not.toBeInTheDocument();

    // Revert the teacher edit as Class Leader (first entry is latest)
    const revertButtons = screen.getAllByRole('button', {
      name: /revert edit on philosophy/i,
    });
    fireEvent.click(revertButtons[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/confirm revert/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/teacher name/i)).toBeInTheDocument();

    // Confirm revert
    fireEvent.click(within(dialog).getByRole('button', { name: /yes, revert edit/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Verify storage has been reverted back to Prof. Socrates
    const subjects = await repo.getSubjects('class-aced-2026');
    const phil = subjects.find((s) => s.id === sub.id);
    expect(phil?.teacherName).toBe('Prof. Socrates');
  });
});
