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

  it('detects Supabase configuration when URL and Publishable Key are present', () => {
    process.env.VITE_SUPABASE_URL = 'https://demo.supabase.co';
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'pub-key-123';
    expect(isSupabaseConfigured()).toBe(true);
    expect(env.supabasePublishableKey).toBe('pub-key-123');
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  });
});
