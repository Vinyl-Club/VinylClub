import { API } from '@/lib/env';
import type { CatalogItem, CatalogDetails} from './types';

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

export async function catalogDetails(id: string): Promise<CatalogDetails> {
  const url = `${API.adDetails}/${id}`;

  console.log('URL appelée :', url);

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Status API :', response.status);
    console.error('Réponse API :', errorText);

    throw new Error(`Erreur détail annonce : ${response.status}`);
  }

  const data = await response.json();
  console.log('DATA DETAILS :', data);

  return data;
}