import { API } from '@/lib/env';
import type { CatalogItem } from './types';

const CATALOG_ERROR_MESSAGE =
  "Impossible de charger le catalogue. Verifie que le backend VinylClub est lance.";

export type CatalogResult = {
  items: CatalogItem[];
  error: string | null;
};

export type CatalogFilters = {
  q?: string;
  genre?: string;
  state?: string;
  format?: string;
  minPrice?: string;
  maxPrice?: string;
};

function appendParam(params: URLSearchParams, key: keyof CatalogFilters, value: unknown) {
  if (typeof value !== 'string') {
    return;
  }

  const trimmed = value.trim();

  if (trimmed) {
    params.set(key, trimmed);
  }
}

function buildCatalogUrl(filters: CatalogFilters = {}) {
  const params = new URLSearchParams();

  appendParam(params, 'q', filters.q);
  appendParam(params, 'genre', filters.genre);
  appendParam(params, 'state', filters.state);
  appendParam(params, 'format', filters.format);
  appendParam(params, 'minPrice', filters.minPrice);
  appendParam(params, 'maxPrice', filters.maxPrice);

  const query = params.toString();
  return query ? `${API.ad}?${query}` : API.ad;
}

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

export async function getCatalog(filters: CatalogFilters = {}): Promise<CatalogResult> {
  try {
    const response = await fetch(buildCatalogUrl(filters), {
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
