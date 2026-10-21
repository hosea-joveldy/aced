import { classroomImportEnabled, getGoogleClientId, isGoogleClassroomConfigured } from '@/lib/env';

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  enrollmentCode?: string;
}

export interface ClassroomAssignmentImport {
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string | null; // 'YYYY-MM-DD'
  notes?: string | null;
}

export interface ClassroomProvider {
  isAvailable(): boolean;
  listCourses(): Promise<ClassroomCourse[]>;
  importAssignments(courseId: string): Promise<ClassroomAssignmentImport[]>;
}

export class NoopClassroomProvider implements ClassroomProvider {
  isAvailable(): boolean {
    return false;
  }

  async listCourses(): Promise<ClassroomCourse[]> {
    return [];
  }

  async importAssignments(): Promise<ClassroomAssignmentImport[]> {
    return [];
  }
}

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    if ((window as unknown as { google?: { accounts?: { oauth2?: unknown } } }).google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Google Identity Services script'))
      );
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
}

export class GoogleClassroomProvider implements ClassroomProvider {
  private static cachedToken: string | null = null;
  private static cachedTokenExpiry: number | null = null;
  private clientId: string;
  private token: string | null = null;

  constructor(clientId = getGoogleClientId() || '') {
    this.clientId = clientId;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const stored = window.sessionStorage.getItem('aced.google_token');
      const expStr = window.sessionStorage.getItem('aced.google_token_expiry');
      if (stored && stored !== 'null' && stored !== 'undefined') {
        const exp = expStr ? Number(expStr) : NaN;
        if (!Number.isFinite(exp) || Date.now() < exp - 30000) {
          GoogleClassroomProvider.cachedToken = stored;
          GoogleClassroomProvider.cachedTokenExpiry = Number.isFinite(exp) ? exp : null;
        } else {
          // Token already expired; clear it from storage
          window.sessionStorage.removeItem('aced.google_token');
          window.sessionStorage.removeItem('aced.google_token_expiry');
          GoogleClassroomProvider.cachedToken = null;
          GoogleClassroomProvider.cachedTokenExpiry = null;
        }
      }
    }
    this.token = GoogleClassroomProvider.cachedToken;
  }

  isAvailable(): boolean {
    return Boolean(this.clientId);
  }

  isTokenExpired(): boolean {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const expStr = window.sessionStorage.getItem('aced.google_token_expiry');
      if (expStr) {
        const exp = Number(expStr);
        if (Number.isFinite(exp) && Date.now() >= exp - 30000) {
          return true;
        }
      }
    }
    if (GoogleClassroomProvider.cachedTokenExpiry) {
      if (Date.now() >= GoogleClassroomProvider.cachedTokenExpiry - 30000) {
        return true;
      }
    }
    return false;
  }

  setToken(token: string, expiresIn = 3599) {
    this.token = token;
    GoogleClassroomProvider.cachedToken = token;
    const expiry = Date.now() + expiresIn * 1000;
    GoogleClassroomProvider.cachedTokenExpiry = expiry;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('aced.google_token', token);
      window.sessionStorage.setItem('aced.google_token_expiry', String(expiry));
    }
  }

  clearToken() {
    this.token = null;
    GoogleClassroomProvider.cachedToken = null;
    GoogleClassroomProvider.cachedTokenExpiry = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem('aced.google_token');
      window.sessionStorage.removeItem('aced.google_token_expiry');
    }
  }

  hasToken(): boolean {
    if (!this.token && !GoogleClassroomProvider.cachedToken) return false;
    if (this.isTokenExpired()) {
      this.clearToken();
      return false;
    }
    return true;
  }

  async requestAccessToken(force = false): Promise<string> {
    if (!force && this.hasToken() && this.token) {
      return this.token;
    }

    if (force) {
      this.clearToken();
    }

    if (typeof window === 'undefined') throw new Error('Browser window required');
    if (!this.clientId) {
      throw new Error(
        'Google Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your .env file.'
      );
    }

    await loadGsiScript();

    return new Promise((resolve, reject) => {
      try {
        const googleObj = (window as unknown as {
          google: {
            accounts: {
              oauth2: {
                initTokenClient: (config: {
                  client_id: string;
                  scope: string;
                  callback: (response: {
                    access_token?: string;
                    error?: string;
                    error_description?: string;
                    expires_in?: number;
                  }) => void;
                }) => { requestAccessToken: (opts?: { prompt?: string }) => void };
              };
            };
          };
        }).google;

        const tokenClient = googleObj.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope:
            'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly',
          callback: (response) => {
            if (response.error) {
              this.clearToken();
              reject(
                new Error(response.error_description || response.error)
              );
            } else if (response.access_token) {
              this.setToken(response.access_token, response.expires_in || 3599);
              resolve(response.access_token);
            } else {
              this.clearToken();
              reject(new Error('No access token returned from Google authentication'));
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: force ? 'consent' : '' });
      } catch (err) {
        this.clearToken();
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  private async authenticatedFetch(url: string): Promise<Response> {
    if (!this.hasToken() || !this.token) {
      await this.requestAccessToken();
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (res.status === 401) {
      this.clearToken();
      throw new Error(
        'Google Classroom authentication has expired or credentials are invalid. Please click "Sign in with Google" to re-authenticate.'
      );
    }

    return res;
  }

  async listCourses(): Promise<ClassroomCourse[]> {
    const res = await this.authenticatedFetch(
      'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE'
    );

    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new Error(
        errData.error?.message || `Failed to fetch Google Classroom courses (${res.status})`
      );
    }

    const data = (await res.json()) as {
      courses?: Array<{
        id: string;
        name: string;
        section?: string;
        enrollmentCode?: string;
      }>;
    };

    return (data.courses || []).map((c) => ({
      id: c.id,
      name: c.name,
      section: c.section,
      enrollmentCode: c.enrollmentCode,
    }));
  }

  async importAssignments(courseId: string): Promise<ClassroomAssignmentImport[]> {
    const res = await this.authenticatedFetch(
      `https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/courseWork`
    );

    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      throw new Error(
        errData.error?.message || `Failed to fetch coursework (${res.status})`
      );
    }

    const data = (await res.json()) as {
      courseWork?: Array<{
        id: string;
        title: string;
        description?: string;
        dueDate?: { year?: number; month?: number; day?: number };
      }>;
    };

    return (data.courseWork || []).map((cw) => {
      let dueDateStr: string | null = null;
      if (cw.dueDate?.year && cw.dueDate?.month && cw.dueDate?.day) {
        const y = String(cw.dueDate.year);
        const m = String(cw.dueDate.month).padStart(2, '0');
        const d = String(cw.dueDate.day).padStart(2, '0');
        dueDateStr = `${y}-${m}-${d}`;
      }

      return {
        title: cw.title,
        courseId,
        courseName: courseId,
        dueDate: dueDateStr,
        notes: cw.description || null,
      };
    });
  }
}

export function createClassroomProvider(): ClassroomProvider {
  if (classroomImportEnabled() && isGoogleClassroomConfigured()) {
    return new GoogleClassroomProvider();
  }
  return new NoopClassroomProvider();
}
