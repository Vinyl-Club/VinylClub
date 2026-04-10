'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './FilterBar.module.css';

type OpenMenu = null | 'genre' | 'etat' | 'prix' | 'format';

export default function FilterBar() {
  const genres = ['Classique', 'Rock', 'Jazz', 'Rap', 'Électro', 'Pop'];
  const etats = ['Neuf', 'Très bon état', 'Bon état', 'Satisfaisant', 'Mauvais état'];
  const formats = [
    '33 RPM',
    '45 RPM',
  ];

  const [open, setOpen] = useState<OpenMenu>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const [genre, setGenre] = useState('');
  const [etat, setEtat] = useState('');
  const [format, setFormat] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const menuRef = useRef<HTMLDivElement | null>(null);

  const genreBtnRef = useRef<HTMLButtonElement | null>(null);
  const etatBtnRef = useRef<HTMLButtonElement | null>(null);
  const prixBtnRef = useRef<HTMLButtonElement | null>(null);
  const formatBtnRef = useRef<HTMLButtonElement | null>(null);

  function toggleMenu(which: Exclude<OpenMenu, null>) {
    const nextOpen = open === which ? null : which;

    if (nextOpen) {
      const ref =
        which === 'genre' ? genreBtnRef :
        which === 'etat' ? etatBtnRef :
        which === 'prix' ? prixBtnRef :
        formatBtnRef;

      const r = ref.current?.getBoundingClientRect();
      if (r) setMenuPos({ top: r.bottom + 6, left: r.left });
    }

    setOpen(nextOpen);
  }

  // Fermer si clic en dehors (menu + boutons)
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const t = e.target as Node;

      const clickedMenu = !!menuRef.current && menuRef.current.contains(t);
      const clickedButton =
        !!genreBtnRef.current?.contains(t) ||
        !!etatBtnRef.current?.contains(t) ||
        !!prixBtnRef.current?.contains(t) ||
        !!formatBtnRef.current?.contains(t);

      if (!clickedMenu && !clickedButton) setOpen(null);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <nav className={styles.nav} aria-label="Filtres">
      <ul className={styles.list}>
        {/* GENRE */}
        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="genre-btn">Genre</label>
          <button
            id="genre-btn"
            ref={genreBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === 'genre'}
            onClick={() => toggleMenu('genre')}
          >
            {genre || 'Genre'}
          </button>

          {open === 'genre' && (
            <div
              ref={menuRef}
              className={styles.menu}
              role="dialog"
              aria-label="Choisir un genre"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles.menuList}>
                {genres.map((g) => (
                  <li key={g}>
                    <button
                      type="button"
                      className={`${styles.optionBtn} ${genre === g ? styles.optionActive : ''}`}
                      onClick={() => setGenre(g)}
                    >
                      {g}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <button type="button" className={styles.applyBtn} onClick={() => setOpen(null)}>
                  Afficher les résultats
                </button>
              </div>
            </div>
          )}
        </li>

        {/* ÉTAT */}
        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="etat-btn">État</label>
          <button
            id="etat-btn"
            ref={etatBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === 'etat'}
            onClick={() => toggleMenu('etat')}
          >
            {etat || 'État'}
          </button>

          {open === 'etat' && (
            <div
              ref={menuRef}
              className={styles.menu}
              role="dialog"
              aria-label="Choisir un état"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles.menuList}>
                {etats.map((e) => (
                  <li key={e}>
                    <button
                      type="button"
                      className={`${styles.optionBtn} ${etat === e ? styles.optionActive : ''}`}
                      onClick={() => setEtat(e)}
                    >
                      {e}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <button type="button" className={styles.applyBtn} onClick={() => setOpen(null)}>
                  Afficher les résultats
                </button>
              </div>
            </div>
          )}
        </li>

        {/* PRIX */}
        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="prix-btn">Prix</label>
          <button
            id="prix-btn"
            ref={prixBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === 'prix'}
            onClick={() => toggleMenu('prix')}
          >
            Prix
          </button>

          {open === 'prix' && (
            <div
              ref={menuRef}
              className={styles.menu}
              role="dialog"
              aria-label="Filtrer par prix"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>De</span>
                <input
                  className={styles.priceInput}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className={styles.euro}>€</span>

                <span className={styles.priceLabel}>À</span>
                <input
                  className={styles.priceInput}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder=""
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                <span className={styles.euro}>€</span>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.applyBtn} onClick={() => setOpen(null)}>
                  Afficher les résultats
                </button>
              </div>
            </div>
          )}
        </li>

        {/* FORMAT */}
        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="format-btn">Format</label>
          <button
            id="format-btn"
            ref={formatBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === 'format'}
            onClick={() => toggleMenu('format')}
          >
            {format || 'Format'}
          </button>

          {open === 'format' && (
            <div
              ref={menuRef}
              className={styles.menu}
              role="dialog"
              aria-label="Choisir un format"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles.menuList}>
                {formats.map((f) => (
                  <li key={f}>
                    <button
                      type="button"
                      className={`${styles.optionBtn} ${format === f ? styles.optionActive : ''}`}
                      onClick={() => setFormat(f)}
                    >
                      {f}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <button type="button" className={styles.applyBtn} onClick={() => setOpen(null)}>
                  Afficher les résultats
                </button>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}