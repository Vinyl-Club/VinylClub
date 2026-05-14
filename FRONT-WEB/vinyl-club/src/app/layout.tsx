import type { Metadata } from 'next';
import '../styles/global.css';

export const metadata: Metadata = {
  title: 'Vinyl Club',
  description: 'Marketplace de vinyles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
