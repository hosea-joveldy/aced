import { describe, it, expect, beforeEach } from 'vitest';
import { createRepository, resetRepository } from '@/lib/storage';
import { LocalRepository } from '@/lib/storage/local';

describe('Storage Factory', () => {
  beforeEach(() => {
    resetRepository();
  });

  it('instantiates LocalRepository when Supabase credentials are missing', () => {
    const repo = createRepository();
    expect(repo).toBeInstanceOf(LocalRepository);
  });

  it('reuses repository instance across multiple invocations', () => {
    const repo1 = createRepository();
    const repo2 = createRepository();
    expect(repo1).toBe(repo2);
  });
});
