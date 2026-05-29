'use client';

import Link from 'next/link';
import styles from './BarFooter.module.css';
import { usePathname } from 'next/navigation';

export default function BarFooter() {
  const pathname = usePathname();
  const hideFooter = pathname === '/login' || pathname === '/register';

  if (hideFooter) return null;

  return (
    <footer className={styles['footer-bar']}>
      <div className={styles['footer-bar__contact']}>
        <section aria-labelledby="footer-contact" className={styles['footer-bar__section']}>
          <h2 id="footer-contact" className={styles['footer-bar__title']}>
            Nous contacter
          </h2>
          <address className={styles['footer-bar__address']}>
            <p>
              <a href="mailto:VinylClub@gmail.com" className={styles['footer-bar__link']}>
                VinylClub@gmail.com
              </a>
            </p>
          </address>
        </section>

        <section aria-labelledby="footer-about" className={styles['footer-bar__section']}>
          <h2 id="footer-about" className={styles['footer-bar__title']}>
            À propos de VinylClub
          </h2>
          <ul className={styles['footer-bar__list']}>
            <li className={styles['footer-bar__list-item']}>
              <Link href="/qui-sommes-nous" className={styles['footer-bar__link']}>
                Qui sommes-nous&nbsp;?
              </Link>
            </li>
          </ul>
        </section>

        <nav aria-labelledby="footer-questions" className={styles['footer-bar__section']}>
          <h2 id="footer-questions" className={styles['footer-bar__title']}>
            Vos questions
          </h2>
          <ul className={styles['footer-bar__list']}>
            <li className={styles['footer-bar__list-item']}>
              <Link href="/faq" className={styles['footer-bar__link']}>
                Questions / Réponses
              </Link>
            </li>
            <li className={styles['footer-bar__list-item']}>
              <Link href="/cgu" className={styles['footer-bar__link']}>
                Conditions générales d&apos;utilisation
              </Link>
            </li>
            <li className={styles['footer-bar__list-item']}>
              <Link href="/cgv" className={styles['footer-bar__link']}>
                Conditions générales de vente
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles['footer-bar__legal']}>
        <div className={styles['footer-bar__copyright']}>
          <small className={styles['footer-bar__copyright-text']}>
            {new Date().getFullYear()} VINYLCLUB — TOUS DROITS RESERVES
          </small>
        </div>

        <nav aria-label="Liens lÃ©gaux" className={styles['footer-bar__legal-links']}>
          <Link href="/mentions-legales" className={styles['footer-bar__link']}>
            Mentions légales
          </Link>
        </nav>
      </div>
    </footer>
  );
}