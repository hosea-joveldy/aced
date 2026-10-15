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

  it('manages Google OAuth token lifecycle and handles expiration and 401s', async () => {
    const { GoogleClassroomProvider } = await import('@/lib/classroom');
    const provider = new GoogleClassroomProvider('test-client-id.apps.googleusercontent.com');

    // Setting token with valid lifespan
    provider.setToken('valid-token-123', 3600);
    expect(provider.hasToken()).toBe(true);
    expect(provider.isTokenExpired()).toBe(false);
    expect(sessionStorage.getItem('aced.google_token')).toBe('valid-token-123');

    // Explicit clearToken
    provider.clearToken();
    expect(provider.hasToken()).toBe(false);
    expect(sessionStorage.getItem('aced.google_token')).toBeNull();
    expect(sessionStorage.getItem('aced.google_token_expiry')).toBeNull();

    // Expired token is detected and cleared
    provider.setToken('expired-token', -10);
    expect(provider.isTokenExpired()).toBe(true);
    expect(provider.hasToken()).toBe(false);

    // 401 response clears token and throws helpful error
    provider.setToken('stale-token', 3600);
    const originalFetch = global.fetch;
    global.fetch = async () =>
      new Response(JSON.stringify({ error: { message: 'Invalid credentials' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });

    await expect(provider.listCourses()).rejects.toThrow(/expired or credentials are invalid/i);
    expect(provider.hasToken()).toBe(false);
    expect(sessionStorage.getItem('aced.google_token')).toBeNull();

    global.fetch = originalFetch;
  });

  it('syncs coursework based strictly on classroomCode without depending on subject name', async () => {
    const { GoogleClassroomProvider } = await import('@/lib/classroom');
    const provider = new GoogleClassroomProvider('test-client-id');
    provider.setToken('valid-token', 3600);

    const originalFetch = global.fetch;
    global.fetch = async (url: string | URL | Request) => {
      const urlStr = String(url);
      if (urlStr.includes('/courses?courseStates=ACTIVE')) {
        return new Response(
          JSON.stringify({
            courses: [
              {
                id: 'course-999',
                name: 'Completely Different Google Classroom Name',
                enrollmentCode: 'mat-401',
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (urlStr.includes('/courseWork')) {
        return new Response(
          JSON.stringify({
            courseWork: [
              {
                id: 'cw-1',
                title: 'Problem Set 1',
                dueDate: { year: 2026, month: 10, day: 25 },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response('Not Found', { status: 404 });
    };

    const imported: Array<{ title: string; courseName: string }> = [];
    const subject = {
      id: 'sub-calc',
      classId: 'c-1',
      name: 'Unrelated Local Subject Name',
      teacherName: 'Mr. Teacher',
      classroomCode: 'mat-401',
      createdAt: '2026-10-01',
    };

    const result = await provider.syncCourseworkForSubject(subject, async (item) => {
      imported.push({ title: item.title, courseName: item.courseName });
    });

    expect(result.count).toBe(1);
    expect(imported).toHaveLength(1);
    expect(imported[0].title).toBe('Problem Set 1');

    // Subject without a classroom code throws an error
    const subjectWithoutCode = { ...subject, classroomCode: null };
    await expect(
      provider.syncCourseworkForSubject(subjectWithoutCode, async () => {})
    ).rejects.toThrow(/does not have a Google Classroom code set/i);

    global.fetch = originalFetch;
  });
});
