'use client';
import styles from './SearchBar.module.css'
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <form
      className={styles.search}
      role="search"
      aria-label="Rechercher"
      onSubmit={(e) => e.preventDefault()}
    >
      <input className={styles.input} type="search" placeholder="Barre de Recherche" />
      <button className={styles.searchBtn} type="submit" aria-label="Bouton Rechercher">
        <Search size={22} strokeWidth={3} />
      </button>
    </form>
  );
}
