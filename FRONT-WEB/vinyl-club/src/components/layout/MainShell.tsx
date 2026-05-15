'use client';

import { usePathname } from 'next/navigation';

type MainShellProps = {
  children: React.ReactNode;
};

export default function MainShell({ children }: MainShellProps) {
  const pathname = usePathname();
  const isCatalogPage = pathname === '/catalog';

  return (
    <main className={isCatalogPage ? 'page-main page-main--catalog' : 'page-main'}>
      {children}
    </main>
  );
}
