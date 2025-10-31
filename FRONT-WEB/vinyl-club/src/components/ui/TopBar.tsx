'use client';
import Image from 'next/image';
import styles from './TopBar.module.css';
import logo from '@/assets/logo.png';

export default function TopBar() {
    return (
        <div className={styles.topbar}>
        {/* Logo */}
        <div className={styles.logo}>
            <Image src={logo} alt="Vinyl Club" width={120} height={40} />
        </div>

        {/* Barre de recherche (statique pour l’instant) */}
        <form className={styles.search} role="search" aria-label="Search">
            <input className={styles.input} type="search" placeholder="Rechercher" />
            <button className={styles.searchBtn} type="submit" aria-label="Rechercher">🔍</button>
        </form>

        {/* Menu burger (pas de logique encore) */}
        <button className={styles.burger} type="button" aria-label="Menu">
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
        </button>
        </div>
    );
}
