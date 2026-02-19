'use client';

import Image from 'next/image';
import styles from './TopBar.module.css';
import logo from '@/assets/logo.png';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import SearchBar from './SearchBar';

export default function TopBar() {
  const [shawLinks, setShawLinks] = useState(false);
  const pathname = usePathname();

  const hideSearch = pathname === '/login' || pathname === '/register';
  
  const handleShawLinks = () => setShawLinks((v) => !v);

  useEffect(() => {
    if(!shawLinks) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === `Escape`) setShawLinks(false);
    };

    window.addEventListener(`keydown`, onKeyDown);
    return () => window.removeEventListener(`keydown`, onKeyDown);
  }, [shawLinks]);

  return (
    <div className={styles.topbar}>
      <Link href="/catalog" className={styles.logoBox} aria-label="Aller à l'accueil">
        <Image src={logo} alt="Vinyl Club" fill className={styles.logoImg} priority />
      </Link>

      {!hideSearch && (
        <div className={styles.searchWrap}>
          <SearchBar />
        </div>
      )}

      <div className={styles.menuWrap}>
        <button
          className={`${styles.burger} ${shawLinks ? styles.open : ''}`}
          type="button"
          aria-label={shawLinks ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-controls="topbar-menu"
          aria-expanded={shawLinks}
          onClick={handleShawLinks}
        >
          <span className={styles.bar} />
        </button>

        <nav aria-label="Navigation principale">
          <ul
            id="topbar-menu"
            hidden={!shawLinks}
            className={`${styles.links} ${shawLinks ? styles.open : ''}`}
          >
            <li className={styles.item}><Link href="/" className={styles.link}>Ajouter une annonce</Link></li>
            <li className={styles.item}><Link href="/" className={styles.link}>Favoris</Link></li>
            <li className={styles.item}><Link href="/" className={styles.link}>Mon profil</Link></li>
            <li className={styles.item}><Link href="/" className={styles.link}>Mes commandes</Link></li>
            <li className={styles.item}><Link href="/" className={styles.link}>Déconnexion</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
