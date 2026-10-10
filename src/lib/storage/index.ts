import type { AcedRepository } from './repository';
import { LocalRepository } from './local';
import { SupabaseRepository } from './supabase';
import { isSupabaseConfigured, getSupabaseUrl, getSupabasePublishableKey } from '@/lib/env';

export * from './repository';
export * from './local';
export * from './supabase';
export * from './seed';

let activeRepository: AcedRepository | null = null;

export function createRepository(): AcedRepository {
  if (activeRepository) {
    return activeRepository;
  }

  if (isSupabaseConfigured()) {
    const url = getSupabaseUrl();
    const key = getSupabasePublishableKey();
    if (url && key) {
      activeRepository = new SupabaseRepository(url, key);
      return activeRepository;
    }
  }

  activeRepository = new LocalRepository();
  return activeRepository;
}

export function resetRepository(): void {
  activeRepository = null;
}
