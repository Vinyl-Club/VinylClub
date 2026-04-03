import { API } from '@/lib/env';
import type { CatalogItem } from './types';

export async function catalog(): Promise<CatalogItem[]> {
  const response = await fetch(API.ad, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Erreur catalogue');
  }

  const data = await response.json();

  return data.content;
}
