import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type ReactNode,
} from 'react';
import type { StudentSession } from '@/types';
import { useRepository } from './RepositoryContext';

const SESSION_STORAGE_KEY = 'aced.session.v1';

interface SessionContextType {
  session: StudentSession | null;
  isLoading: boolean;
  error: string | null;
  joinClass: (email: string, displayName: string, classCode: string) => Promise<boolean>;
  leaveClass: () => void;
  clearError: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const repo = useRepository();
  const [session, setSession] = useState<StudentSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function initSession() {
      try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<StudentSession>;
          if (parsed.displayName && (parsed.classId || parsed.classCode)) {
            // Validate and synchronize with the active repository
            let cls = parsed.classId ? await repo.getClassById(parsed.classId) : null;
            if (!cls && parsed.classCode) {
              cls = await repo.getClassByCode(parsed.classCode);
            }
            if (!cls && (!parsed.classCode || parsed.classCode.toUpperCase() === 'ACED2026')) {
              cls = await repo.getClassByCode('ACED2026');
            }

            if (cls && !isCancelled) {
              const email =
                parsed.email ||
                `${parsed.displayName.toLowerCase().replace(/\s+/g, '.')}@aced.school`;
              const isLeader =
                Boolean(cls.leaderEmail) &&
                cls.leaderEmail.trim().toLowerCase() === email.toLowerCase();

              const validated: StudentSession = {
                email,
                displayName: parsed.displayName,
                classCode: cls.code,
                classId: cls.id,
                className: cls.name,
                isClassLeader: isLeader,
              };

              localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(validated));
              setSession(validated);
              return;
            } else if (!cls && !isCancelled) {
              localStorage.removeItem(SESSION_STORAGE_KEY);
              setSession(null);
            }
          }
        }
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    return () => {
      isCancelled = true;
    };
  }, [repo]);

  const joinClass = async (
    email: string,
    displayName: string,
    classCode: string
  ): Promise<boolean> => {
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = displayName.trim();
    const trimmedCode = classCode.trim().toUpperCase();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return false;
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!trimmedName) {
      setError('Please enter your name.');
      return false;
    }

    if (!trimmedCode) {
      setError('Please enter a class code.');
      return false;
    }

    try {
      const cls = await repo.getClassByCode(trimmedCode);
      if (!cls) {
        setError(`Class code "${trimmedCode}" not found. Try the demo class ACED2026.`);
        return false;
      }

      const isLeader =
        Boolean(cls.leaderEmail) &&
        cls.leaderEmail.trim().toLowerCase() === trimmedEmail;

      const newSession: StudentSession = {
        email: trimmedEmail,
        displayName: trimmedName,
        classCode: cls.code,
        classId: cls.id,
        className: cls.name,
        isClassLeader: isLeader,
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to join class';
      setError(msg);
      return false;
    }
  };

  const leaveClass = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        error,
        joinClass,
        leaveClass,
        clearError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
