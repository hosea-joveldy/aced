import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { RepositoryProvider } from '@/context/RepositoryContext';
import { SessionProvider } from '@/context/SessionContext';
import { BoardScreen } from '@/screens/BoardScreen';
import { LocalRepository } from '@/lib/storage/local';
import { setToday } from '@/lib/date';

describe('BoardScreen Component', () => {
  let repo: LocalRepository;

  beforeEach(() => {
    localStorage.clear();
    setToday('2026-10-10');
    repo = new LocalRepository('test.board.db');
    localStorage.setItem(
      'aced.session.v1',
      JSON.stringify({
        displayName: 'Board Tester',
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
          <BoardScreen />
        </SessionProvider>
      </RepositoryProvider>
    );

  it('renders summary metrics strip with non-zero counts for overdue, today, and needs date', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Assignments & Deadlines')).toBeInTheDocument();
    });

    const summary = screen.getByLabelText(/deadline summary metrics/i);
    expect(summary).toBeInTheDocument();
    expect(within(summary).getByText('Overdue')).toBeInTheDocument();
    expect(within(summary).getByText('Due Today')).toBeInTheDocument();
    expect(within(summary).getByText('Needs Date')).toBeInTheDocument();
  });

  it('displays grouped views with headers and assignments', async () => {
    renderScreen();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /^needs a date$/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /^overdue$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^due today$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^done$/i })).toBeInTheDocument();

    // Specific seed assignment titles
    expect(screen.getByText('Calculus Problem Set 4')).toBeInTheDocument();
    expect(screen.getByText('Art Portfolio Brainstorm')).toBeInTheDocument();
  });

  it('filters assignments by subject and resets filter', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('Calculus Problem Set 4')).toBeInTheDocument();
    });

    // Filter by Computer Science
    const csFilterBtn = screen.getByRole('button', { name: 'Computer Science' });
    fireEvent.click(csFilterBtn);

    expect(
      screen.getByText('CS Binary Search Trees Implementation')
    ).toBeInTheDocument();
    expect(screen.queryByText('Calculus Problem Set 4')).not.toBeInTheDocument();

    // Reset filter
    const allSubjectsBtn = screen.getByRole('button', { name: 'All Subjects' });
    fireEvent.click(allSubjectsBtn);

    expect(screen.getByText('Calculus Problem Set 4')).toBeInTheDocument();
  });

  it('toggles assignment completion moving it to Done', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('History Chapter 14 Quiz Prep')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', {
      name: /mark "history chapter 14 quiz prep" as complete/i,
    });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', {
          name: /mark "history chapter 14 quiz prep" as incomplete/i,
        })
      ).toBeInTheDocument();
    });
  });
});
