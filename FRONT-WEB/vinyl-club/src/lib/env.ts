const BASE = process.env.NEXT_PUBLIC_API_BASE;
if (!BASE) throw new Error('NEXT_PUBLIC_API_BASE is missing (.env.local)');

export const API = {
    base: BASE,
    images: `${BASE}/api/images/`,
    auth:   `${BASE}/auth/login`,
    product: `${BASE}/api/products`,
    register: `${BASE}/auth/register`,
    logout: `${BASE}/auth/logout`,
    createAd: `${BASE}/api/ad`,
    categories: `${BASE}/api/categories`,
    artist: `${BASE}/api/artists`,
    searchArtist: `${BASE}/api/artists/search`,
    album: `${BASE}/api/albums`,
    searchAlbum: `${BASE}/api/albums/search`,
} as const;