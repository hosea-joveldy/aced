import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssignmentModal } from '@/components/board/AssignmentModal';
import type { Subject, Assignment } from '@/types';

describe('AssignmentModal Component', () => {
  const dummySubjects: Subject[] = [
    {
      id: 'sub-1',
      classId: 'c-1',
      name: 'Biology',
      teacherName: 'Dr. Smith',
      createdAt: '2026-10-01',
    },
    {
      id: 'sub-2',
      classId: 'c-1',
      name: 'History',
      teacherName: 'Mr. Adams',
      createdAt: '2026-10-01',
    },
  ];

  it('validates required title field', async () => {
    const handleSave = vi.fn();
    render(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        subjects={dummySubjects}
        onSave={handleSave}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add assignment/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it('validates invalid YYYY-MM-DD due date format', async () => {
    const handleSave = vi.fn();
    render(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        subjects={dummySubjects}
        onSave={handleSave}
      />
    );

    fireEvent.change(screen.getByLabelText(/assignment title \*/i), {
      target: { value: 'Cell Lab' },
    });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2026-99-99' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add assignment/i }));

    expect(
      await screen.findByText(/due date must be a valid date in yyyy-mm-dd format/i)
    ).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it('submits valid assignment with optional date and notes', async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        subjects={dummySubjects}
        onSave={handleSave}
      />
    );

    fireEvent.change(screen.getByLabelText(/assignment title \*/i), {
      target: { value: 'Photosynthesis Lab' },
    });
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2026-10-15' },
    });
    fireEvent.change(screen.getByLabelText(/notes & instructions/i), {
      target: { value: 'Bring microscope slides' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add assignment/i }));

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith({
        title: 'Photosynthesis Lab',
        subjectId: 'sub-1',
        dueDate: '2026-10-15',
        notes: 'Bring microscope slides',
      });
    });
  });

  it('populates fields when editing an existing assignment', () => {
    const existing: Assignment = {
      id: 'asg-edit-1',
      classId: 'c-1',
      subjectId: 'sub-2',
      title: 'French Revolution Essay',
      dueDate: '2026-10-20',
      notes: '3 pages double spaced',
      completed: false,
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01',
    };

    render(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        assignment={existing}
        subjects={dummySubjects}
        onSave={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { name: /edit assignment/i })
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('French Revolution Essay')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-10-20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3 pages double spaced')).toBeInTheDocument();
  });
});
