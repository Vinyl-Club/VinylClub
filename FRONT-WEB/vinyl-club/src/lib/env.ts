const BASE = process.env.NEXT_PUBLIC_API_BASE;
if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE is missing (.env.local)");

export const API = {
  base: BASE,
  images: `${BASE}/api/images/`,
  auth: `${BASE}/auth/login`,
  ad: `${BASE}/api/ad`,
  register: `${BASE}/auth/register`,
  logout: `${BASE}/auth/logout`,
} as const;
