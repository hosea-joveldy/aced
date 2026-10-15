import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Enforce offline and unconfigured Supabase & Classroom in unit/component tests
if (typeof process !== 'undefined' && process.env) {
  delete process.env.VITE_SUPABASE_URL;
  delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  delete process.env.VITE_SUPABASE_ANON_KEY;
  delete process.env.VITE_FEATURE_CLASSROOM_IMPORT;
  delete process.env.VITE_GOOGLE_CLIENT_ID;
  delete process.env.VITE_GOOGLE_API_KEY;
}

// Any network fetch must fail tests immediately per AGENTS.md §8
globalThis.fetch = () => {
  throw new Error('Network fetch is strictly forbidden in tests per AGENTS.md §8');
};
