import { API } from '@/lib/env';
import type { CatalogItem } from './types';

const CATALOG_ERROR_MESSAGE =
  "Impossible de charger le catalogue. Verifie que le backend VinylClub est lance.";

export type CatalogResult = {
  items: CatalogItem[];
  error: string | null;
};

function extractCatalogItems(data: unknown): CatalogItem[] {
  if (Array.isArray(data)) {
    return data as CatalogItem[];
  }

  if (data && typeof data === 'object' && 'content' in data) {
    const { content } = data as { content?: unknown };
    return Array.isArray(content) ? (content as CatalogItem[]) : [];
  }

  return [];
}

export async function getCatalog(): Promise<CatalogResult> {
  try {
    const response = await fetch(API.ad, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(
        `Catalog request failed: ${response.status} ${response.statusText}`,
      );
      return { items: [], error: CATALOG_ERROR_MESSAGE };
    }

    const data = await response.json();
    return { items: extractCatalogItems(data), error: null };
  } catch (error) {
    console.error('Catalog request failed:', error);
    return { items: [], error: CATALOG_ERROR_MESSAGE };
  }
}

export async function catalog(): Promise<CatalogItem[]> {
  const result = await getCatalog();
  return result.items;
}
