'use client';

import Image from 'next/image';
import styles from './TopBar.module.css';
import logo from '@/assets/logo.png';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/features/auth/actions.server';
import type { AuthSessionUser } from '@/lib/auth.Server';

import SearchBar from './SearchBar';

type TopBarProps = {
  currentUser: AuthSessionUser | null;
};

function getUserLabel(user: AuthSessionUser) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

  return fullName || user.email || (user.id ? `Utilisateur #${user.id}` : 'Connecte');
}

export default function TopBar({ currentUser }: TopBarProps) {
  const [shawLinks, setShawLinks] = useState(false);
  const pathname = usePathname();
  const userLabel = currentUser ? getUserLabel(currentUser) : null;

  const hideSearch = pathname === '/login' || pathname === '/register';
  const hideMenu = pathname === '/login' || pathname === '/register';

  const handleShawLinks = () => setShawLinks((v) => !v);

  useEffect(() => {
    if (!shawLinks) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShawLinks(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shawLinks]);

  useEffect(() => {
    setShawLinks(false);
  }, [pathname]);

  return (
    <div className={styles.topbar}>
      <Link href="/catalog" className={styles.logoBox} aria-label="Aller a l'accueil">
        <Image
          src={logo}
          alt="Vinyl Club"
          fill
          className={styles.logoImg}
          priority
        />
      </Link>

      {!hideSearch && (
        <div className={styles.searchWrap}>
          <SearchBar />
        </div>
      )}

      {!hideMenu && (
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
              {currentUser && userLabel && (
                <li className={`${styles.item} ${styles.session}`}>
                  <span className={styles.sessionLabel}>Connecte en tant que</span>
                  <span className={styles.sessionName}>{userLabel}</span>
                  {currentUser.role && (
                    <span className={styles.sessionRole}>{currentUser.role}</span>
                  )}
                </li>
              )}

              <li className={styles.item}>
                <Link
                  href="/ads/create"
                  className={styles.link}
                  onClick={() => setShawLinks(false)}
                >
                  Ajouter une annonce
                </Link>
              </li>
              <li className={styles.item}>
                <Link href="/" className={styles.link} onClick={() => setShawLinks(false)}>
                  Favoris
                </Link>
              </li>

              {currentUser ? (
                <>
                  <li className={styles.item}>
                    <Link
                      href="/profile"
                      className={styles.link}
                      onClick={() => setShawLinks(false)}
                    >
                      Mon profil
                    </Link>
                  </li>
                  <li className={styles.item}>
                    <Link href="/" className={styles.link} onClick={() => setShawLinks(false)}>
                      Mes commandes
                    </Link>
                  </li>
                  <li className={styles.item}>
                    <form action={logoutAction}>
                      <button type="submit" className={styles.link}>
                        Deconnexion
                      </button>
                    </form>
                  </li>
                </>
              ) : (
                <>
                  <li className={styles.item}>
                    <Link
                      href="/login"
                      className={styles.link}
                      onClick={() => setShawLinks(false)}
                    >
                      Connexion
                    </Link>
                  </li>
                  <li className={styles.item}>
                    <Link
                      href="/register"
                      className={styles.link}
                      onClick={() => setShawLinks(false)}
                    >
                      Inscription
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
