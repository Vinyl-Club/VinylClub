'use server';

import { API } from '@/lib/env';
import { getAuthToken } from '@/lib/auth.Server';
import type { State, Album, Artist } from './types';

export async function findOrCreateArtistId(name: string): Promise<number> {
  const trimmedArtistName = name.trim();

  if (!trimmedArtistName) {
    throw new Error("L'artiste est obligatoire.");
  }

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

  const token = await getAuthToken();

  const createResponse = await fetch(API.artist, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `auth=${token}`,
    },
    body: JSON.stringify({ name: trimmedArtistName }),
    cache: 'no-store',
  });

  const raw = await createResponse.text();

  if (!createResponse.ok) {
    let parsedMessage = '';

    try {
      const parsed: unknown = raw ? JSON.parse(raw) : null;

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const apiErrors = parsed as Record<string, unknown>;

        for (const messages of Object.values(apiErrors)) {
          if (Array.isArray(messages) && messages.length > 0) {
            parsedMessage = String(messages[0]);
            break;
          }
        }
      }
    } catch {
      // pas JSON
    }

    throw new Error(parsedMessage || raw || "Impossible de créer l'artiste.");
  }

  const contentType = createResponse.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    throw new Error("Réponse invalide du serveur (pas du JSON)");
  }

  const createdArtist: Artist = raw ? JSON.parse(raw) : null;

  if (!createdArtist?.id) {
    throw new Error("Réponse invalide : id artiste manquant.");
  }

  return createdArtist.id;
}

export async function findOrCreateAlbumId(name: string): Promise<number> {
  const trimmedAlbumName = name.trim();

   if (!trimmedAlbumName) {
    throw new Error("L'album est obligatoire.");
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

  const token = await getAuthToken();

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
    const raw = await createResponse.text();

    let parsedMessage = '';

    try {
      const parsed: unknown = raw ? JSON.parse(raw) : null;

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const apiErrors = parsed as Record<string, unknown>;

        for (const messages of Object.values(apiErrors)) {
          if (Array.isArray(messages) && messages.length > 0) {
            parsedMessage = String(messages[0]);
            break;
          }
        }
      }
    } catch {
      // pas JSON ou format inattendu
    }

    throw new Error(parsedMessage || raw || "Impossible de créer l'album.");
  }

  const contentType = createResponse.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    throw new Error("Réponse invalide du serveur (pas du JSON)");
  }

  const createdAlbum: Album = await createResponse.json();
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

    const token = await getAuthToken();

    const payload = {
      product: {
        title,
        description,
        price,
        state,
        format,
        artist: { id: artistId },
        category: { id: categoryId },
        album: { id: albumId },
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
      const raw = await response.text();

      try {
        const parsed: unknown = raw ? JSON.parse(raw) : null;

        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const apiErrors = parsed as Record<string, unknown>;
          const fieldErrors: Record<string, string> = {};

          for (const [field, messages] of Object.entries(apiErrors)) {
            const firstMessage =
              Array.isArray(messages) && messages.length > 0
                ? String(messages[0])
                : String(messages ?? '');

            let cleanField = field;

            if (cleanField.startsWith('product.')) {
              cleanField = cleanField.replace('product.', '');
            }

            if (cleanField === 'title') cleanField = 'titre';
            if (cleanField === 'artist' || cleanField === 'artist.id') cleanField = 'artiste';
            if (cleanField === 'album' || cleanField === 'album.id') cleanField = 'album';
            if (cleanField === 'category' || cleanField === 'category.id') cleanField = 'style';
            if (cleanField === 'state') cleanField = 'etat';
            if (cleanField === 'price') cleanField = 'prix';

            if (!fieldErrors[cleanField]) {
              fieldErrors[cleanField] = firstMessage;
            }
          }

          return {
            fieldErrors,
            formError: '',
          };
        }
      } catch {
        // pas JSON
      }

      return {
        fieldErrors: {},
        formError: raw || "Erreur lors de la création de l'annonce",
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