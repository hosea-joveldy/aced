import { describe, it, expect } from 'vitest';
import { isSupabaseConfigured, classroomImportEnabled, env } from '@/lib/env';

describe('Environment Reader', () => {
  it('returns false for isSupabaseConfigured when env vars are absent', () => {
    expect(isSupabaseConfigured()).toBe(false);
    expect(env.isSupabaseConfigured).toBe(false);
  });

  it('defaults classroomImportEnabled to false', () => {
    expect(classroomImportEnabled()).toBe(false);
    expect(env.classroomImportEnabled).toBe(false);
  });
});
