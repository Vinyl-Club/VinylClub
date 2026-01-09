"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./FilterBar.module.css";

type OpenMenu = null | "genre" | "etat" | "prix" | "format";

export default function FilterBar() {
  const pathname = usePathname();
  const hideFilterBar = pathname === "/login" || pathname === "/register";

  const genres = ["Classique", "Rock", "Jazz", "Rap", "Electro", "Pop"];
  const etats = [
    "Neuf",
    "Tres bon etat",
    "Bon etat",
    "Satisfaisant",
    "Mauvais etat",
  ];
  const formats = ["33 RPM", "45 RPM"];

  const [open, setOpen] = useState<OpenMenu>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const [genre, setGenre] = useState("");
  const [etat, setEtat] = useState("");
  const [format, setFormat] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const menuRef = useRef<HTMLDivElement | null>(null);

  const genreBtnRef = useRef<HTMLButtonElement | null>(null);
  const etatBtnRef = useRef<HTMLButtonElement | null>(null);
  const prixBtnRef = useRef<HTMLButtonElement | null>(null);
  const formatBtnRef = useRef<HTMLButtonElement | null>(null);

  function toggleMenu(which: Exclude<OpenMenu, null>) {
    const nextOpen = open === which ? null : which;

    if (nextOpen) {
      const ref =
        which === "genre"
          ? genreBtnRef
          : which === "etat"
            ? etatBtnRef
            : which === "prix"
              ? prixBtnRef
              : formatBtnRef;

      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        setMenuPos({ top: rect.bottom + 6, left: rect.left });
      }
    }

    setOpen(nextOpen);
  }

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

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (hideFilterBar) {
    return null;
  }

  return (
    <nav className={styles.nav} aria-label="Filtres">
      <ul className={styles.list}>
        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="genre-btn">
            Genre
          </label>
          <button
            id="genre-btn"
            ref={genreBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === "genre"}
            onClick={() => toggleMenu("genre")}
          >
            {genre || "Genre"}
          </button>

          {open === "genre" && (
            <div
              ref={menuRef}
              className={styles.menu}
              role="dialog"
              aria-label="Choisir un genre"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles.menuList}>
                {genres.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className={`${styles.optionBtn} ${genre === item ? styles.optionActive : ""}`}
                      onClick={() => setGenre(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.applyBtn}
                  onClick={() => setOpen(null)}
                >
                  Afficher les resultats
                </button>
              </div>
            </div>
          )}
        </li>

        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="etat-btn">
            Etat
          </label>
          <button
            id="etat-btn"
            ref={etatBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === "etat"}
            onClick={() => toggleMenu("etat")}
          >
            {etat || "Etat"}
          </button>

          {open === "etat" && (
            <div
              ref={menuRef}
              className={styles.menu}
              role="dialog"
              aria-label="Choisir un etat"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles.menuList}>
                {etats.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className={`${styles.optionBtn} ${etat === item ? styles.optionActive : ""}`}
                      onClick={() => setEtat(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.applyBtn}
                  onClick={() => setOpen(null)}
                >
                  Afficher les resultats
                </button>
              </div>
            </div>
          )}
        </li>

        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="prix-btn">
            Prix
          </label>
          <button
            id="prix-btn"
            ref={prixBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === "prix"}
            onClick={() => toggleMenu("prix")}
          >
            Prix
          </button>

          {open === "prix" && (
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
                  onChange={(event) => setMinPrice(event.target.value)}
                />
                <span className={styles.euro}>EUR</span>

                <span className={styles.priceLabel}>A</span>
                <input
                  className={styles.priceInput}
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
                <span className={styles.euro}>EUR</span>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.applyBtn}
                  onClick={() => setOpen(null)}
                >
                  Afficher les resultats
                </button>
              </div>
            </div>
          )}
        </li>

        <li className={styles.dropdown}>
          <label className={styles.srOnly} htmlFor="format-btn">
            Format
          </label>
          <button
            id="format-btn"
            ref={formatBtnRef}
            type="button"
            className={`${styles.item} ${styles.dropdownBtn}`}
            aria-haspopup="dialog"
            aria-expanded={open === "format"}
            onClick={() => toggleMenu("format")}
          >
            {format || "Format"}
          </button>

          {open === "format" && (
            <div
              ref={menuRef}
              className={styles.menu}
              role="dialog"
              aria-label="Choisir un format"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <ul className={styles.menuList}>
                {formats.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className={`${styles.optionBtn} ${format === item ? styles.optionActive : ""}`}
                      onClick={() => setFormat(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.applyBtn}
                  onClick={() => setOpen(null)}
                >
                  Afficher les resultats
                </button>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
