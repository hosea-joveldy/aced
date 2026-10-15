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

export function getSupabasePublishableKey(): string | undefined {
  const publishable = getEnvValue('VITE_SUPABASE_PUBLISHABLE_KEY');
  if (publishable && publishable.trim().length > 0) return publishable.trim();
  const anon = getEnvValue('VITE_SUPABASE_ANON_KEY');
  return anon && anon.trim().length > 0 ? anon.trim() : undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  return getSupabasePublishableKey();
}

/**
 * Returns true if both Supabase URL and Publishable/Anon Key are present and non-empty.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

/**
 * Returns true if the Classroom Import feature flag is explicitly enabled.
 */
export function classroomImportEnabled(): boolean {
  const val = getEnvValue('VITE_FEATURE_CLASSROOM_IMPORT');
  return val === 'true' || val === '1';
}

export function getGoogleClientId(): string | undefined {
  const id = getEnvValue('VITE_GOOGLE_CLIENT_ID');
  return id && id.trim().length > 0 ? id.trim() : undefined;
}

export function getGoogleApiKey(): string | undefined {
  const key = getEnvValue('VITE_GOOGLE_API_KEY');
  return key && key.trim().length > 0 ? key.trim() : undefined;
}

export function isGoogleClassroomConfigured(): boolean {
  return Boolean(getGoogleClientId());
}

export const env = {
  get isSupabaseConfigured() {
    return isSupabaseConfigured();
  },
  get classroomImportEnabled() {
    return classroomImportEnabled();
  },
  get googleClientId() {
    return getGoogleClientId();
  },
  get googleApiKey() {
    return getGoogleApiKey();
  },
  get isGoogleClassroomConfigured() {
    return isGoogleClassroomConfigured();
  },
  get supabaseUrl() {
    return getSupabaseUrl();
  },
  get supabasePublishableKey() {
    return getSupabasePublishableKey();
  },
  get supabaseAnonKey() {
    return getSupabasePublishableKey();
  },
};
