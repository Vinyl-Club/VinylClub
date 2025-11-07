'use client';
import Image from 'next/image';
import styles from './TopBar.module.css';
import logo from '@/assets/logo.png';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TopBar() {
  const [shawLinks, setShawLinks] = useState(false);

  const handleShowLinks = () => {
    setShawLinks(!shawLinks); // on garde ton handle
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.logoBox}>
        <Image src={logo} alt="Vinyl Club"
          fill
          className={styles.logoImg} priority
        />
      </div>

      <form className={styles.search} role="search" aria-label="Search">
        <input className={styles.input} type="search" placeholder="Rechercher" />
        <button className={styles.searchBtn} type="submit" aria-label="Rechercher">
          <Search size={22} strokeWidth={3} />
        </button>
      </form>

      {/* panneau de liens : fermé par défaut, visible avec .open */}
      <ul
        id="topbar-menu"
        className={`${styles.links} ${shawLinks ? styles.open : ''}`}
      >
        <li className={styles.item}>
          <Link href="/"className={styles.link}>
            Ajouter
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Favoris
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Mon profil
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Mes commandes
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Déconnexion
          </Link>
        </li>
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
