import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <nav className="flex gap-4">
          <Link href="/">Accueil</Link>
          <Link href="/catalog">Catalogue</Link>
          <Link href="/login">Connexion</Link>
          <Link href="/register">Inscription</Link>
        </nav>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="p-4 border-t text-sm">
        &copy; {new Date().getFullYear()} Vinyl Club
      </footer>
    </div>
  );
}
