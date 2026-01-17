'use client';
import Link from 'next/link';
import styles from './BarFooter.module.css';

export default function BarFooter() {
    return (
        <footer className={styles.footerContainer}>
        <div className={styles.contactBar}>
            <section aria-labelledby="footer-contact" className={styles.contactInfo}>
                <h2>Nous contacter</h2>
                <address>
                    <p>
                    <a href="mailto:VinylClub@gmail.com">VinylClub@gmail.com</a>
                    </p>
                </address>
            </section>

            <section aria-labelledby="footer-about" className={styles.aboutUs}>
                <h2>À propos de VynilClub</h2>
                <ul>
                    <li>
                    <Link href="/a-propos">Qui sommes-nous&nbsp;?</Link>
                    </li>
                </ul>
            </section>

            <nav aria-labelledby="footer-questions" className={styles.questions}>
                <h2>Vos questions</h2>
                <ul>
                    <li><Link href="/faq">Questions / Réponses</Link></li>
                    <li><Link href="/cgu">Conditions générales d&apos;utilisation</Link></li>
                    <li><Link href="/cgv">Conditions générales de vente</Link></li>
                </ul>
            </nav>
        </div>

        <div className={styles.legalBar}>
            <div className={styles.copyRight}>
            <small>VYNILCLUB — TOUS DROITS RESERVES</small>
            </div>

            <nav aria-label="Liens légaux" className={styles.legalLinks}>
                <Link href="/mentions-legales">Mentions légales</Link>
            </nav>
        </div>
        </footer>
    );
}
