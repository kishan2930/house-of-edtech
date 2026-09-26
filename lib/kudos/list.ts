import type { KudosItem } from '@/lib/kudos/types';

export async function listKudos(): Promise<{ kudos: KudosItem[] }> {
  return { kudos: [] };
}
