import styles from '../layout/PagesStatic.module.css';

export default function Faq() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Questions / Réponses</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Qu&apos;est-ce que Vinyl Club ?</h2>
        <p className={styles.text}>
          Vinyl Club est une plateforme dédiée aux passionnés de vinyles. Elle permet
          mettre en relations des particuliers pour l&apos;achat, la ventes de vinyles tous en 
          consultant, publiant et découvrant des annonces autour de disques vinyles.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Faut-il créer un compte pour utiliser le site ?</h2>
        <p className={styles.text}>
          La consultation de certaines pages peut être accessible librement, mais la publication
          d&apos;une annonce et l&apos;accès à certaines fonctionnalités nécessitent la création d&apos;un compte.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Comment publier une annonce ?</h2>
        <p className={styles.text}>
          Une fois connecté à votre compte, vous pouvez accéder au formulaire d&apos;ajout d&apos;annonce
          et renseigner les informations demandées comme le titre, la description, le prix,
          la catégorie et les images.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Puis-je ajouter plusieurs photos à mon annonce ?</h2>
        <p className={styles.text}>
          Oui, selon les fonctionnalités disponibles sur la plateforme, vous pouvez ajouter
          plusieurs images afin de présenter au mieux votre vinyle.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Les annonces sont-elles vérifiées ?</h2>
        <p className={styles.text}>
          Vinyl Club met à disposition une plateforme de publication d&apos;annonces, mais ne garantit
          pas systématiquement l&apos;authenticité ou la conformité de chaque annonce. Les utilisateurs
          doivent rester vigilants avant toute transaction.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Comment contacter un vendeur ?</h2>
        <p className={styles.text}>
          Les modalités de contact sont en cours de réalisation sur la plateforme. Une fois présente, cette
          section sera mise à jour.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Puis-je modifier ou supprimer une annonce ?</h2>
        <p className={styles.text}>
          Oui, un utilisateur connecté peut généralement gérer ses propres annonces depuis son espace
          personnel, notamment pour les modifier ou les supprimer.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Que faire en cas de problème avec une annonce ?</h2>
        <p className={styles.text}>
          En cas de contenu inapproprié, d&apos;erreur ou de comportement abusif, nous vous invitons
          à contacter l&apos;équipe du site via l&apos;adresse de contact indiquée dans les mentions légales.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>9. Mes données personnelles sont-elles protégées ?</h2>
        <p className={styles.text}>
          Oui, les données personnelles collectées sont utilisées uniquement dans le cadre
          du fonctionnement du site et sont traitées conformément à la réglementation applicable.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>10. Le site est-il destiné uniquement aux collectionneurs ?</h2>
        <p className={styles.text}>
          Non, Vinyl Club s&apos;adresse à tous les amateurs de musique et de vinyles, qu&apos;ils soient
          collectionneurs expérimentés, curieux ou débutants.
        </p>
      </div>
    </div>
  );
}