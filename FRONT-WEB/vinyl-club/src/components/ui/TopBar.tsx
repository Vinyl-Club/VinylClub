'use client';
import Image from 'next/image';
import styles from './TopBar.module.css';
import logo from '@/assets/logo.png';
import { Search } from 'lucide-react';

export default function TopBar() {
    return (
        <div className={styles.topbar}>
        <div className={styles.logoBox}>
            <Image
                src={logo}
                alt="Vinyl Club"
                fill                        // ← pas de width/height, on remplit la box
                className={styles.logoImg}
                priority
            />
        </div>


        <form className={styles.search} role="search" aria-label="Search">
            <input className={styles.input} type="search" placeholder="Rechercher" />
            <button className={styles.searchBtn} type="submit" aria-label="Rechercher"><Search size={22} strokeWidth={3}/></button>
        </form>

        <button className={styles.burger} type="button" aria-label="Menu">
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
        </button>
        </div>
    );
}
