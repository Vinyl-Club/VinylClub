'use client';
import styles from './FilterBar.module.css';
import { usePathname } from 'next/navigation';

export default function FilterBar() {
    const pathname = usePathname();
    // cache la filer bar sur les pages login et register
    const hideFilterBar = pathname === '/login' || pathname === '/register';
  // juste des boutons “filtres” statiques, sans logique pour l’instant
    const items = ['Genre', 'Prix', 'État', 'Format'];

    if(hideFilterBar) return null;

    return (
        <nav className={styles.nav} aria-label="Filtres">
            <ul className={styles.list}>
                {items.map((label) => (
                <li key={label}>
                    <button className={styles.item} type="button">{label}</button>
                </li>
                ))}
            </ul>
        </nav>
    );
}
