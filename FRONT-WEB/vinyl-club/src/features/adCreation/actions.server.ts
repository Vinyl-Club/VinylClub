'use server';

import { API } from '@/lib/env';
import { cookies } from 'next/headers';
import type { State, Album, Artist } from './types';

export async function findOrCreateArtistId(name: string): Promise<number> {
  const trimmedArtistName = name.trim();

  const searchArtist = await fetch(
    `${API.searchArtist}?query=${encodeURIComponent(trimmedArtistName)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  if (!searchArtist.ok) {
    throw new Error("Impossible de rechercher l'artiste.");
  }

  const artists: Artist[] = await searchArtist.json();

  const exactMatch = artists.find(
    (artist) => artist.name.trim().toLowerCase() === trimmedArtistName.toLowerCase()
  );

  if (exactMatch) {
    return exactMatch.id;
  }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;

  const createResponse = await fetch(API.artist, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
        Cookie: `auth=${token}`,
    },
    body: JSON.stringify({ name: trimmedArtistName }),
    cache: 'no-store',
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(errorText || "Impossible de créer l'artiste.");
  }

  const raw = await createResponse.text();

  if (!raw) {
    throw new Error("Réponse vide lors de la création de l'artiste.");
  }

  const createdArtist: Artist = JSON.parse(raw);
  return createdArtist.id;
}

export async function findOrCreateAlbumId(name: string): Promise<number | null> {
  const trimmedAlbumName = name.trim();

  if (!trimmedAlbumName) {
    return null;
  }

  const searchAlbum = await fetch(
    `${API.searchAlbum}?query=${encodeURIComponent(trimmedAlbumName)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  if (!searchAlbum.ok) {
    throw new Error("Impossible de rechercher l'album.");
  }

  const albums: Album[] = await searchAlbum.json();

  const exactMatch = albums.find(
    (album) => album.name.trim().toLowerCase() === trimmedAlbumName.toLowerCase()
  );

  if (exactMatch) {
    return exactMatch.id;
  }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;

  const createResponse = await fetch(API.album, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
        Cookie: `auth=${token}`,
    },
    body: JSON.stringify({ name: trimmedAlbumName }),
    cache: 'no-store',
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(errorText || "Impossible de créer l'album.");
  }

  const raw = await createResponse.text();

  if (!raw) {
    throw new Error("Réponse vide lors de la création de l'album.");
  }

  const createdAlbum: Album = JSON.parse(raw);
  return createdAlbum.id;
}

export async function createAdAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const title = String(formData.get('titre') ?? '').trim();
    const artistName = String(formData.get('artiste') ?? '').trim();
    const albumName = String(formData.get('album') ?? '').trim();
    const categoryId = Number(formData.get('style') ?? '');
    const description = String(formData.get('description') ?? '').trim();
    const state = String(formData.get('etat') ?? '').trim();
    const price = Number(formData.get('prix') ?? '');
    const format = String(formData.get('format') ?? '').trim();

    const artistId = await findOrCreateArtistId(artistName);
    const albumId = await findOrCreateAlbumId(albumName);

    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;

    const payload = {
      product: {
        title,
        description,
        price,
        status: 'AVAILABLE',
        state,
        format,
        artist: { id: artistId },
        category: { id: categoryId },
        album: albumId ? { id: albumId } : null,
      },
    };

    const response = await fetch(API.createAd, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `auth=${token}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();

      return {
        fieldErrors: {},
        formError: errorText || "Erreur lors de la création de l'annonce",
      };
    }

    return {
      fieldErrors: {},
      formError: '',
    };
  } catch (error) {
    return {
      fieldErrors: {},
      formError:
        error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
}