import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { RepositoryProvider } from '@/context/RepositoryContext';
import { SessionProvider } from '@/context/SessionContext';
import { JoinClassForm } from '@/components/auth/JoinClassForm';
import { LocalRepository } from '@/lib/storage/local';

describe('JoinClassForm Component', () => {
  let repo: LocalRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalRepository('test.join.db');
  });

  const renderWithProviders = () =>
    render(
      <RepositoryProvider repository={repo}>
        <SessionProvider>
          <JoinClassForm />
        </SessionProvider>
      </RepositoryProvider>
    );

  it('renders input fields with accessible labels and buttons', () => {
    renderWithProviders();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/class code/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /enter class/i })
    ).toBeInTheDocument();
  });

  it('validates required name field', async () => {
    renderWithProviders();
    const submitBtn = screen.getByRole('button', { name: /enter class/i });

    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/please enter your name/i)
    ).toBeInTheDocument();
  });

  it('fills demo class code upon clicking button', () => {
    renderWithProviders();
    const demoBtn = screen.getByRole('button', { name: /fill demo code/i });
    fireEvent.click(demoBtn);

    const codeInput = screen.getByLabelText(/class code/i) as HTMLInputElement;
    expect(codeInput.value).toBe('ACED2026');
  });

  it('shows error for non-existent class code', async () => {
    renderWithProviders();
    const nameInput = screen.getByLabelText(/your name/i);
    const codeInput = screen.getByLabelText(/class code/i);
    const submitBtn = screen.getByRole('button', { name: /enter class/i });

    fireEvent.change(nameInput, { target: { value: 'Alex' } });
    fireEvent.change(codeInput, { target: { value: 'NONEXISTENT' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/class code "NONEXISTENT" not found/i)
      ).toBeInTheDocument();
    });
  });
});
