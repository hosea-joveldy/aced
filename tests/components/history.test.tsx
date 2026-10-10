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
    });

    expect(screen.getByText(/Alex M\./i)).toBeInTheDocument();
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
});
