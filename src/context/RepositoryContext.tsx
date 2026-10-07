import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import type { AcedRepository } from '@/lib/storage/repository';
import { createRepository } from '@/lib/storage';

const RepositoryContext = createContext<AcedRepository | null>(null);

export const RepositoryProvider: FC<{
  children: ReactNode;
  repository?: AcedRepository;
}> = ({ children, repository }) => {
  const repo = useMemo(() => repository || createRepository(), [repository]);

  return (
    <RepositoryContext.Provider value={repo}>
      {children}
    </RepositoryContext.Provider>
  );
};

export function useRepository(): AcedRepository {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
}
