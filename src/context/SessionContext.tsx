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
  joinClass: (displayName: string, classCode: string) => Promise<boolean>;
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
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StudentSession;
        if (parsed.classId && parsed.displayName && parsed.classCode) {
          setSession(parsed);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinClass = async (
    displayName: string,
    classCode: string
  ): Promise<boolean> => {
    setError(null);
    const trimmedName = displayName.trim();
    const trimmedCode = classCode.trim().toUpperCase();

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

      const newSession: StudentSession = {
        displayName: trimmedName,
        classCode: cls.code,
        classId: cls.id,
        className: cls.name,
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
