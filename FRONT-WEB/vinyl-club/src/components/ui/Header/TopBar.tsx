'use client';

import Image from 'next/image';
import styles from './TopBar.module.css';
import logo from '@/assets/logo.png';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import SearchBar from './SearchBar';

export default function TopBar() {
  const [shawLinks, setShawLinks] = useState(false);
  const pathname = usePathname();

  const hideSearch = pathname === '/login' || pathname === '/register';
  

  const handleShowLinks = () => setShawLinks(!shawLinks);

  return (
    <div className={styles.topbar}>
      <div className={styles.logoBox}>
        <Image src={logo} alt="Vinyl Club" fill className={styles.logoImg} priority />
      </div>

      {/* colonne du milieu (1fr) */}
      {!hideSearch && (
        <div className={styles.searchWrap}>
          <SearchBar />
        </div>
      )}

      {/* menu */}
      <ul
        id="topbar-menu"
        className={`${styles.links} ${shawLinks ? styles.open : ''}`}
      >
        <li className={styles.item}><Link href="/" className={styles.link}>Ajouter</Link></li>
        <li className={styles.item}><Link href="/" className={styles.link}>Favoris</Link></li>
        <li className={styles.item}><Link href="/" className={styles.link}>Mon profil</Link></li>
        <li className={styles.item}><Link href="/" className={styles.link}>Mes commandes</Link></li>
        <li className={styles.item}><Link href="/" className={styles.link}>Déconnexion</Link></li>
      </ul>

      <button
        className={`${styles.burger} ${shawLinks ? styles.open : ''}`}
        type="button"
        aria-label="Menu"
        aria-controls="topbar-menu"
        aria-expanded={shawLinks}
        onClick={handleShowLinks}
      >
        <span className={styles.bar} />
      </button>
    </div>

  );
}
