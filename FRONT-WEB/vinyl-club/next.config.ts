// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
        { protocol: 'http', hostname: 'localhost', port: '8080', pathname: '/**' },
        // ajoute d'autres domaines si besoin
        ],
    },
};

export default nextConfig;
