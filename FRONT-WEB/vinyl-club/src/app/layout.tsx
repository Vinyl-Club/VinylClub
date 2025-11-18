import type { Metadata } from 'next';
import '../styles/global.css';
import { Bebas_Neue, Anton } from 'next/font/google';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
});

export const metadata: Metadata = {
  title: 'Vinyl Club',
  description: 'Marketplace de vinyles',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bebas.variable} ${anton.variable}`}>
      <body>{children}</body>
    </html>
  );
}
