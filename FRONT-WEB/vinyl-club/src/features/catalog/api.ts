import { API } from '@/lib/env';
import type { Product } from './types';

export async function catalog(): Promise<Product[]> {
  const response = await fetch(API.product, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Erreur catalogue');
  }

  const data = await response.json();

  return data.content; 
}
