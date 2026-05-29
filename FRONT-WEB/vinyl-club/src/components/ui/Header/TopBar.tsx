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
  const [showLinks, setShowLinks] = useState(false);
  const pathname = usePathname();
  const userLabel = currentUser ? getUserLabel(currentUser) : null;
  const favoritesHref = currentUser ? '/favorite' : '/login';

  const hideSearch = pathname === '/login' || pathname === '/register';
  const hideMenu = pathname === '/login' || pathname === '/register';

  const handleShowLinks = () => setShowLinks((value) => !value);

  useEffect(() => {
    if (!showLinks) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowLinks(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showLinks]);

  useEffect(() => {
    setShowLinks(false);
  }, [pathname]);

  return (
    <div className={styles.topbar}>
      <Link href="/catalog" className={styles['topbar__logo-box']} aria-label="Aller a l'accueil">
        <Image
          src={logo}
          alt="Vinyl Club"
          fill
          className={styles['topbar__logo-image']}
          priority
        />
      </Link>

      {!hideSearch && (
        <div className={styles['topbar__search-wrap']}>
          <SearchBar />
        </div>
      )}

      {!hideMenu && (
        <div className={styles['topbar__menu-wrap']}>
          <button
            className={[
              styles['topbar__burger'],
              showLinks ? styles['topbar__burger--open'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            aria-label={showLinks ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-controls="topbar-menu"
            aria-expanded={showLinks}
            onClick={handleShowLinks}
          >
            <span className={styles['topbar__burger-line']} />
          </button>

          <nav aria-label="Navigation principale">
            <ul
              id="topbar-menu"
              hidden={!showLinks}
              className={[
                styles['topbar__links'],
                showLinks ? styles['topbar__links--open'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {currentUser && userLabel && (
                <li className={[styles['topbar__item'], styles['topbar__session']].join(' ')}>
                  <span className={styles['topbar__session-label']}>Connecte en tant que</span>
                  <span className={styles['topbar__session-name']}>{userLabel}</span>
                  {currentUser.role && (
                    <span className={styles['topbar__session-role']}>{currentUser.role}</span>
                  )}
                </li>
              )}

              <li className={styles['topbar__item']}>
                <Link
                  href="/ads/create"
                  className={styles['topbar__link']}
                  onClick={() => setShowLinks(false)}
                >
                  Ajouter une annonce
                </Link>
              </li>
              <li className={styles['topbar__item']}>
                <Link
                  href={favoritesHref}
                  className={styles['topbar__link']}
                  onClick={() => setShowLinks(false)}
                >
                  Favoris
                </Link>
              </li>

              {currentUser ? (
                <>
                  <li className={styles['topbar__item']}>
                    <Link
                      href="/profile"
                      className={styles['topbar__link']}
                      onClick={() => setShowLinks(false)}
                    >
                      Mon profil
                    </Link>
                  </li>
                  <li className={styles['topbar__item']}>
                    <Link
                      href="/"
                      className={styles['topbar__link']}
                      onClick={() => setShowLinks(false)}
                    >
                      Mes commandes
                    </Link>
                  </li>
                  <li className={styles['topbar__item']}>
                    <form action={logoutAction}>
                      <button type="submit" className={styles['topbar__link']}>
                        Deconnexion
                      </button>
                    </form>
                  </li>
                </>
              ) : (
                <>
                  <li className={styles['topbar__item']}>
                    <Link
                      href="/login"
                      className={styles['topbar__link']}
                      onClick={() => setShowLinks(false)}
                    >
                      Connexion
                    </Link>
                  </li>
                  <li className={styles['topbar__item']}>
                    <Link
                      href="/register"
                      className={styles['topbar__link']}
                      onClick={() => setShowLinks(false)}
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
