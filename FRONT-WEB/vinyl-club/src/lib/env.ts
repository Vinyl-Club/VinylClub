const BASE = process.env.NEXT_PUBLIC_API_BASE;
if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE is missing (.env.local)");

export const API = {
  base: BASE,
  images: `${BASE}/api/images/`,
  auth: `${BASE}/auth/login`,
  authMe: `${BASE}/auth/me`,
  users: `${BASE}/api/users`,
  addresses: `${BASE}/api/addresses`,
  product: `${BASE}/api/products`,
  register: `${BASE}/auth/register`,
  logout: `${BASE}/auth/logout`,
  createAd: `${BASE}/api/ad`,
  categories: `${BASE}/api/categories`,
  artist: `${BASE}/api/artists`,
  searchArtist: `${BASE}/api/artists/search`,
  album: `${BASE}/api/albums`,
  searchAlbum: `${BASE}/api/albums/search`,
  ad: `${BASE}/api/ad`,
  adDetails: `${BASE}/api/ad`,
  profileAds: `${BASE}/api/ad/mine`,
  favoriteAds: `${BASE}/api/ad/products`,
  favorites: `${BASE}/api/favorites`,
} as const;
