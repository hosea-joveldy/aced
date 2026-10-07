import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClassroomImportButton } from '@/components/classroom/ClassroomImportButton';
import { createClassroomProvider, NoopClassroomProvider } from '@/lib/classroom';
import { classroomImportEnabled } from '@/lib/env';

describe('Classroom Feature & Noop Provider', () => {
  it('creates a NoopClassroomProvider returning empty offline safe data', async () => {
    const provider = createClassroomProvider();
    expect(provider).toBeInstanceOf(NoopClassroomProvider);
    expect(provider.isAvailable()).toBe(false);

    const courses = await provider.listCourses();
    expect(courses).toEqual([]);

    const assignments = await provider.importAssignments('c-1');
    expect(assignments).toEqual([]);
  });

  it('omits ClassroomImportButton from DOM completely when feature flag is off', () => {
    expect(classroomImportEnabled()).toBe(false);

    const { container } = render(<ClassroomImportButton />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('classroom-import-button')).not.toBeInTheDocument();
    expect(screen.queryByText(/classroom import/i)).not.toBeInTheDocument();
  });
});
