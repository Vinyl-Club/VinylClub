import styles from '../layout/PagesStatic.module.css';

export default function QuiSommesNous() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Qui sommes-nous ?</h1>

      <div className={styles.section}>
        <p className={styles.text}>
          Vinyl Club est un projet réalisé par des étudiants passionnés de musique et de vinyles.
        </p>

        <p className={styles.text}>
          Animés par notre attachement à cet objet emblématique, nous avons imaginé une plateforme
          permettant aux amateurs de vinyles de découvrir, partager et donner une seconde vie à leurs disques.
        </p>

        <p className={styles.text}>
          Nous croyons en une consommation plus responsable, où chaque vinyle peut continuer à vivre
          entre les mains de nouveaux passionnés. À travers ce projet, nous souhaitons contribuer à rendre
          la culture musicale plus accessible tout en valorisant la réutilisation des objets.
        </p>
      </div>
    </div>
  );
}