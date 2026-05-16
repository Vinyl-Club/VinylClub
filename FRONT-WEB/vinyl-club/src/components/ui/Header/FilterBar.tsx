'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button/Button';
import styles from './FilterBar.module.css';

type OpenMenu = null | 'genre' | 'etat' | 'prix' | 'format';
type FilterOption = {
  value: string;
  label: string;
};

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideFilterBar = pathname === '/login' || pathname === '/register';

  const genres: FilterOption[] = [
    { value: 'Classique', label: 'Classique' },
    { value: 'Rock', label: 'Rock' },
    { value: 'Jazz', label: 'Jazz' },
    { value: 'Rap', label: 'Rap' },
    { value: 'Electro', label: 'Electro' },
    { value: 'Pop', label: 'Pop' },
  ];
  const etats: FilterOption[] = [
    { value: 'TRES_BON_ETAT', label: 'Tres bon etat' },
    { value: 'BON_ETAT', label: 'Bon etat' },
    { value: 'MAUVAIS_ETAT', label: 'Mauvais etat' },
  ];
  const formats: FilterOption[] = [
    { value: 'T33', label: '33 Tours' },
    { value: 'T45', label: '45 Tours' },
    { value: 'T78', label: '78 Tours' },
  ];

  const [open, setOpen] = useState<OpenMenu>(null);
  // const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

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

  function getOptionLabel(options: FilterOption[], value: string) {
    return options.find((option) => option.value === value)?.label ?? value;
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    const nextFilters = {
      genre,
      state: etat,
      format,
      minPrice,
      maxPrice,
    };

    Object.entries(nextFilters).forEach(([key, value]) => {
      const trimmed = value.trim();

      if (trimmed) {
        params.set(key, trimmed);
      } else {
        params.delete(key);
      }
    });

    params.delete('page');

    const queryString = params.toString();
    router.push(queryString ? `/catalog?${queryString}` : '/catalog');
    setOpen(null);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    ['genre', 'state', 'format', 'minPrice', 'maxPrice', 'page'].forEach((key) =>
      params.delete(key),
    );

    setGenre('');
    setEtat('');
    setFormat('');
    setMinPrice('');
    setMaxPrice('');
    setOpen(null);

    const queryString = params.toString();
    router.push(queryString ? `/catalog?${queryString}` : '/catalog');
  }

  // function toggleMenu(which: Exclude<OpenMenu, null>) {
  //   const nextOpen = open === which ? null : which;

  //   if (nextOpen) {
  //     const ref =
  //       which === 'genre'
  //         ? genreBtnRef
  //         : which === 'etat'
  //           ? etatBtnRef
  //           : which === 'prix'
  //             ? prixBtnRef
  //             : formatBtnRef;

  //     const rect = ref.current?.getBoundingClientRect();
  //     if (rect) {
  //       setMenuPos({ top: rect.bottom + 6, left: rect.left });
  //     }
  //   }
  //   setOpen(nextOpen);
  // }

  function toggleMenu(which: Exclude<OpenMenu, null>) {
  setOpen(open === which ? null : which);
}

  useEffect(() => {
    setGenre(searchParams.get('genre') ?? '');
    setEtat(searchParams.get('state') ?? '');
    setFormat(searchParams.get('format') ?? '');
    setMinPrice(searchParams.get('minPrice') ?? '');
    setMaxPrice(searchParams.get('maxPrice') ?? '');
  }, [searchParams]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;

      const clickedMenu = !!menuRef.current && menuRef.current.contains(target);
      const clickedButton =
        !!genreBtnRef.current?.contains(target) ||
        !!etatBtnRef.current?.contains(target) ||
        !!prixBtnRef.current?.contains(target) ||
        !!formatBtnRef.current?.contains(target);

      if (!clickedMenu && !clickedButton) {
        setOpen(null);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  if (hideFilterBar) {
    return null;
  }

  return (
    <nav className={styles['filter-bar']} aria-label="Filtres">
      <ul className={styles['filter-bar__list']}>
        <li className={styles['filter-bar__dropdown']}>
          <label className={styles['filter-bar__visually-hidden']} htmlFor="genre-btn">
            Genre
          </label>
          <button
            id="genre-btn"
            ref={genreBtnRef}
            type="button"
            className={[
              styles['filter-bar__item'],
              styles['filter-bar__dropdown-button'],
            ].join(' ')}
            aria-haspopup="dialog"
            aria-expanded={open === 'genre'}
            onClick={() => toggleMenu('genre')}
          >
            {genre ? getOptionLabel(genres, genre) : 'Genre'}
          </button>

          {open === 'genre' && (
            <div
              ref={menuRef}
              className={styles['filter-bar__menu']}
              role="dialog"
              aria-label="Choisir un genre"
              // style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles['filter-bar__menu-list']}>
                {genres.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      className={[
                        styles['filter-bar__option-button'],
                        genre === item.value ? styles['filter-bar__option-button--active'] : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setGenre(item.value)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles['filter-bar__actions']}>
                <Button type="button" variant="secondary" size="sm" onClick={applyFilters}>
                  Afficher les resultats
                </Button>
              </div>
            </div>
          )}
        </li>

        <li className={styles['filter-bar__dropdown']}>
          <label className={styles['filter-bar__visually-hidden']} htmlFor="prix-btn">
            Prix
          </label>
          <button
            id="prix-btn"
            ref={prixBtnRef}
            type="button"
            className={[
              styles['filter-bar__item'],
              styles['filter-bar__dropdown-button'],
            ].join(' ')}
            aria-haspopup="dialog"
            aria-expanded={open === 'prix'}
            onClick={() => toggleMenu('prix')}
          >
            Prix
          </button>

          {open === 'prix' && (
            <div
              ref={menuRef}
              className={styles['filter-bar__menu']}
              role="dialog"
              aria-label="Filtrer par prix"
              // style={{ top: menuPos.top, left: menuPos.left }}
            >
              <div className={styles['filter-bar__price-row']}>
                <span className={styles['filter-bar__price-label']}>De</span>
                <input
                  className={styles['filter-bar__price-input']}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
                <span className={styles['filter-bar__euro']}>EUR</span>

                <span className={styles['filter-bar__price-label']}>A</span>
                <input
                  className={styles['filter-bar__price-input']}
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
                <span className={styles['filter-bar__euro']}>EUR</span>
              </div>

              <div className={styles['filter-bar__actions']}>
                <Button type="button" variant="secondary" size="sm" onClick={applyFilters}>
                  Afficher les resultats
                </Button>
              </div>
            </div>
          )}
        </li>

        <li className={styles['filter-bar__dropdown']}>
          <label className={styles['filter-bar__visually-hidden']} htmlFor="etat-btn">
            Etat
          </label>
          <button
            id="etat-btn"
            ref={etatBtnRef}
            type="button"
            className={[
              styles['filter-bar__item'],
              styles['filter-bar__dropdown-button'],
            ].join(' ')}
            aria-haspopup="dialog"
            aria-expanded={open === 'etat'}
            onClick={() => toggleMenu('etat')}
          >
            {etat ? getOptionLabel(etats, etat) : 'Etat'}
          </button>

          {open === 'etat' && (
            <div
              ref={menuRef}
              className={styles['filter-bar__menu']}
              role="dialog"
              aria-label="Choisir un etat"
              // style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles['filter-bar__menu-list']}>
                {etats.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      className={[
                        styles['filter-bar__option-button'],
                        etat === item.value ? styles['filter-bar__option-button--active'] : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setEtat(item.value)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles['filter-bar__actions']}>
                <Button type="button" variant="secondary" size="sm" onClick={applyFilters}>
                  Afficher les resultats
                </Button>
              </div>
            </div>
          )}
        </li>

        <li className={styles['filter-bar__dropdown']}>
          <label className={styles['filter-bar__visually-hidden']} htmlFor="format-btn">
            Format
          </label>
          <button
            id="format-btn"
            ref={formatBtnRef}
            type="button"
            className={[
              styles['filter-bar__item'],
              styles['filter-bar__dropdown-button'],
            ].join(' ')}
            aria-haspopup="dialog"
            aria-expanded={open === 'format'}
            onClick={() => toggleMenu('format')}
          >
            {format ? getOptionLabel(formats, format) : 'Format'}
          </button>

          {open === 'format' && (
            <div
              ref={menuRef}
              className={styles['filter-bar__menu']}
              role="dialog"
              aria-label="Choisir un format"
              // style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles['filter-bar__menu-list']}>
                {formats.map((item) => (
                  <li key={item.value}>
                    <button
                      type="button"
                      className={[
                        styles['filter-bar__option-button'],
                        format === item.value ? styles['filter-bar__option-button--active'] : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setFormat(item.value)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles['filter-bar__actions']}>
                <Button type="button" variant="secondary" size="sm" onClick={applyFilters}>
                  Afficher les resultats
                </Button>
              </div>
            </div>
          )}
        </li>

        {(genre || etat || format || minPrice || maxPrice) && (
          <li className={styles['filter-bar__dropdown']}>
            <button
              type="button"
              className={[
                styles['filter-bar__item'],
                styles['filter-bar__item--reset'],
              ].join(' ')}
              onClick={clearFilters}
            >
              Reinitialiser
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
