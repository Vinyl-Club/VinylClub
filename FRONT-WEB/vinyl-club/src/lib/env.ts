const BASE = process.env.NEXT_PUBLIC_API_BASE;
if (!BASE) throw new Error('NEXT_PUBLIC_API_BASE is missing (.env.local)');

export const API = {
    base: BASE,
    images: `${BASE}/api/images/`,
    auth:   `${BASE}/auth`,
    product: `${BASE}/api/products`,
} as const;