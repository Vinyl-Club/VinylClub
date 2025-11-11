'use client';
import styles from './FilterBar.module.css';

export default function FilterBar() {
  // juste des boutons “filtres” statiques, sans logique pour l’instant
    const items = ['Genre', 'Prix', 'État', 'Format'];

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
