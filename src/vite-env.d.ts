/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_FEATURE_CLASSROOM_IMPORT?: string;
  readonly PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
