import styles from '../layout/PagesStatic.module.css';

export default function MentionsLegals() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Mentions Légales</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Éditeur du site</h2>
        <p className={styles.text}>Le site Vinyl Club est édité par :</p>
        <ul className={styles.list}>
          <li>Charlotte Beck, Sébastien Herbiet, Floriane Boireau</li>
          <li>Statut : Projet étudiant</li>
          <li>Email : VinylClub@gmail.com</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Hébergement</h2>
        <p className={styles.text}>Le site est hébergé par :</p>
        <ul className={styles.list}>
          <li>Hébergeur :</li>
          <li>Site web :</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Propriété intellectuelle</h2>
        <p className={styles.text}>
          L&apos;ensemble des contenus présents sur le site (textes, images, logos, design, code)
          est la propriété exclusive de Vinyl Club, sauf mention contraire.
        </p>
        <p className={styles.text}>
          Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Données personnelles</h2>
        <p className={styles.text}>
          Le site peut collecter certaines données personnelles (ex : email, compte utilisateur).
        </p>
        <p className={styles.text}>
          Ces données sont utilisées uniquement dans le cadre du fonctionnement du service
          (authentification, gestion des annonces, etc.).
        </p>
        <p className={styles.text}>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification
          et de suppression de vos données.
        </p>
        <p className={styles.text}>
          Pour exercer ce droit, contactez : VinylClub@gmail.com
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Cookies</h2>
        <p className={styles.text}>
          Le site utilise des cookies nécessaires à son fonctionnement (authentification, session).
        </p>
        <p className={styles.text}>
          Aucun cookie publicitaire n&apos;est utilisé sans consentement.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Responsabilité</h2>
        <p className={styles.text}>
          Vinyl Club s&apos;efforce de fournir des informations fiables, mais ne garantit pas
          l&apos;exactitude ou l&apos;exhaustivité des contenus.
        </p>
        <p className={styles.text}>
          L&apos;utilisateur reste responsable de l&apos;utilisation qu&apos;il fait du site.
        </p>
      </div>
    </div>
  );
}