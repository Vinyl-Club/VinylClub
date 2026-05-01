'use client';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    } else {
      params.delete('q');
    }

    params.delete('page');

    const targetPath = pathname === '/catalog' ? pathname : '/catalog';
    const queryString = params.toString();
    router.push(queryString ? `${targetPath}?${queryString}` : targetPath);
  }

  return (
    <form
      className={styles.search}
      role="search"
      aria-label="Rechercher"
      onSubmit={handleSubmit}
    >
      <input
        className={styles.input}
        type="search"
        name="q"
        placeholder="Rechercher"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button className={styles.searchBtn} type="submit" aria-label="Bouton Rechercher">
        <Search size={22} strokeWidth={3} />
      </button>
    </form>
  );
}
