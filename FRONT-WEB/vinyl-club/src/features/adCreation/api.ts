'use client';

import type { Category } from './types.ts';
import { API } from '@/lib/env';

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(API.categories, {
    method: 'GET',
    cache: 'no-store',
});
    console.log(response)

  if (!response.ok) {
    throw new Error('Impossible de récupérer les catégories');
  }

  return response.json();
}