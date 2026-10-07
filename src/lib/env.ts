function getEnvValue(key: string): string | undefined {
  try {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env[key] !== undefined
    ) {
      const val = import.meta.env[key];
      return typeof val === 'string' ? val : String(val);
    }
  } catch {
    // Suppress runtime env lookup errors
  }

  try {
    if (
      typeof process !== 'undefined' &&
      process.env &&
      process.env[key] !== undefined
    ) {
      return process.env[key];
    }
  } catch {
    // Suppress runtime env lookup errors
  }

  return undefined;
}

export function getSupabaseUrl(): string | undefined {
  const url = getEnvValue('VITE_SUPABASE_URL');
  return url && url.trim().length > 0 ? url.trim() : undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const key = getEnvValue('VITE_SUPABASE_ANON_KEY');
  return key && key.trim().length > 0 ? key.trim() : undefined;
}

/**
 * Returns true if both Supabase URL and Anon Key are present and non-empty.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/**
 * Returns true if the Classroom Import feature flag is explicitly enabled.
 */
export function classroomImportEnabled(): boolean {
  const val = getEnvValue('VITE_FEATURE_CLASSROOM_IMPORT');
  return val === 'true' || val === '1';
}

export const env = {
  get isSupabaseConfigured() {
    return isSupabaseConfigured();
  },
  get classroomImportEnabled() {
    return classroomImportEnabled();
  },
  get supabaseUrl() {
    return getSupabaseUrl();
  },
  get supabaseAnonKey() {
    return getSupabaseAnonKey();
  },
};
