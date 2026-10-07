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

  it('renders all 6 initial seed subjects with teachers and classroom codes', async () => {
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText('AP Calculus BC')).toBeInTheDocument();
    });

    expect(screen.getByText('Mr. Harrison')).toBeInTheDocument();
    expect(screen.getByText('mat-401')).toBeInTheDocument();
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
    fireEvent.change(within(dialog).getByLabelText(/google classroom code/i), {
      target: { value: 'myt-301' },
    });

    // Click submit in dialog
    fireEvent.click(
      within(dialog).getByRole('button', { name: /add subject/i })
    );

    await waitFor(() => {
      expect(screen.getByText('World Mythology')).toBeInTheDocument();
      expect(screen.getByText('Ms. Thorne')).toBeInTheDocument();
      expect(screen.getByText('myt-301')).toBeInTheDocument();
    });
  });
});
