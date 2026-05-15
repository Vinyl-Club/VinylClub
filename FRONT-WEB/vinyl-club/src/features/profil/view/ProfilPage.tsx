'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useEffect, useState, type FormEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { API } from '@/lib/env';
import {
  deleteAccountAction,
  deleteProfileAdAction,
  updateProfileAction,
} from '../actions.server';
import type {
  ProfileDeleteState,
  ProfileFormState,
  ProfilePageData,
  ProfileTab,
} from '../types';
import styles from './ProfilPage.module.css';

type ProfilPageProps = {
  activeTab: ProfileTab;
  profileData: ProfilePageData;
};

const initialFormState: ProfileFormState = {
  fieldErrors: {},
  formError: '',
  successMessage: '',
};

const initialDeleteState: ProfileDeleteState = {
  formError: '',
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function resolveCoverUrl(imageUrl: string | null) {
  if (!imageUrl) return null;

  return imageUrl.startsWith('http') ? imageUrl : `${API.base}${imageUrl}`;
}

function ConfirmDeleteAccountButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`${styles.modal__button} ${styles['modal__button--danger']}`}
      disabled={pending}
    >
      {pending ? 'Suppression...' : 'Oui, supprimer'}
    </button>
  );
}

function DeleteAdSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.listingCard__deleteBtn} disabled={pending}>
      {pending ? 'Suppression...' : 'Supprimer'}
    </button>
  );
}

function DeleteAdForm({ adId, title }: { adId: number; title: string }) {
  const [state, formAction] = useActionState(deleteProfileAdAction, initialDeleteState);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Supprimer l'annonce "${title}" ?`)) {
      event.preventDefault();
    }
  }

  return (
    <form className={styles.listingCard__deleteForm} action={formAction} onSubmit={handleSubmit}>
      <input type="hidden" name="adId" value={adId} />
      <DeleteAdSubmitButton />
      {state.formError && <p className={styles.listingCard__error}>{state.formError}</p>}
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className={styles.form__fieldError}>{message}</p>;
}

export default function ProfilPage({ activeTab, profileData }: ProfilPageProps) {
  const [formState, profileFormAction, isProfilePending] = useActionState(
    updateProfileAction,
    initialFormState,
  );
  const [deleteAccountState, deleteAccountFormAction] = useActionState(
    deleteAccountAction,
    initialDeleteState,
  );
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const title = activeTab === 'ads' ? 'Mes annonces' : 'Mon profil';
  const address = profileData.address;

  useEffect(() => {
    if (!isDeleteAccountModalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDeleteAccountModalOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeleteAccountModalOpen]);

  return (
    <section className={styles.profile}>
      <div className={styles.profile__inner}>
        <h1 className={styles.profile__title}>{title}</h1>

        <nav className={styles.tabs} aria-label="Navigation profil">
          <Link
            href="/profile"
            className={`${styles.tabs__link} ${
              activeTab === 'profile' ? styles['tabs__link--active'] : ''
            }`}
          >
            Mon Profil
          </Link>
          <Link
            href="/profile?tab=ads"
            className={`${styles.tabs__link} ${
              activeTab === 'ads' ? styles['tabs__link--active'] : ''
            }`}
          >
            Mes annonces
          </Link>
        </nav>

        {activeTab === 'profile' ? (
          <div className={styles.panel}>
            <form id="profile-form" className={styles.form} action={profileFormAction}>
              <div className={styles.form__field}>
                <label htmlFor="lastName" className={styles.srOnly}>
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={profileData.user.lastName}
                  placeholder="Nom"
                  className={styles.form__input}
                  autoComplete="family-name"
                />
                <FieldError message={formState.fieldErrors.lastName} />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="firstName" className={styles.srOnly}>
                  Prenom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={profileData.user.firstName}
                  placeholder="Prenom"
                  className={styles.form__input}
                  autoComplete="given-name"
                />
                <FieldError message={formState.fieldErrors.firstName} />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="email" className={styles.srOnly}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={profileData.user.email}
                  placeholder="Email"
                  className={styles.form__input}
                  autoComplete="email"
                />
                <FieldError message={formState.fieldErrors.email} />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="password" className={styles.srOnly}>
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue=""
                  placeholder="Mot de passe"
                  className={styles.form__input}
                  autoComplete="new-password"
                />
                <p className={styles.form__hint}>Laissez vide pour conserver votre mot de passe.</p>
                <FieldError message={formState.fieldErrors.password} />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="street" className={styles.srOnly}>
                  Adresse
                </label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  defaultValue={address?.street ?? ''}
                  placeholder="Adresse"
                  className={styles.form__input}
                  autoComplete="street-address"
                />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="zipCode" className={styles.srOnly}>
                  Code postal
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  defaultValue={address?.zipCode ?? ''}
                  placeholder="Code postal"
                  className={styles.form__input}
                  autoComplete="postal-code"
                />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="city" className={styles.srOnly}>
                  Ville
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={address?.city ?? ''}
                  placeholder="Ville"
                  className={styles.form__input}
                  autoComplete="address-level2"
                />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="country" className={styles.srOnly}>
                  Pays
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  defaultValue={address?.country ?? ''}
                  placeholder="Pays"
                  className={styles.form__input}
                  autoComplete="country-name"
                />
              </div>
            </form>

            {(formState.formError || formState.successMessage || deleteAccountState.formError) && (
              <div className={styles.feedback} aria-live="polite">
                {formState.formError && (
                  <p className={styles.feedback__error}>{formState.formError}</p>
                )}
                {deleteAccountState.formError && (
                  <p className={styles.feedback__error}>{deleteAccountState.formError}</p>
                )}
                {formState.successMessage && (
                  <p className={styles.feedback__success}>{formState.successMessage}</p>
                )}
              </div>
            )}

            <div className={styles.actions}>
              <form
                id="delete-account-form"
                action={deleteAccountFormAction}
                className={styles.deleteAccountForm}
              >
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles['actionButton--danger']}`}
                  aria-haspopup="dialog"
                  aria-expanded={isDeleteAccountModalOpen}
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                >
                  Supprimer
                </button>

                {isDeleteAccountModalOpen ? (
                  <div
                    className={styles.modal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-account-title"
                    onClick={() => setIsDeleteAccountModalOpen(false)}
                  >
                    <div
                      className={styles.modal__panel}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <h2 id="delete-account-title" className={styles.modal__title}>
                        Supprimer mon compte
                      </h2>
                      <p className={styles.modal__text}>
                        Es-tu sure de vouloir supprimer ton compte ? Cette action supprimera
                        aussi toutes tes annonces et ne pourra pas etre annulee.
                      </p>

                      <div className={styles.modal__actions}>
                        <button
                          type="button"
                          className={`${styles.modal__button} ${styles['modal__button--ghost']}`}
                          onClick={() => setIsDeleteAccountModalOpen(false)}
                        >
                          Annuler
                        </button>
                        <ConfirmDeleteAccountButton />
                      </div>
                    </div>
                  </div>
                ) : null}
              </form>

              <button
                type="submit"
                form="profile-form"
                className={`${styles.actionButton} ${styles['actionButton--primary']}`}
                disabled={isProfilePending}
              >
                {isProfilePending ? 'Validation...' : 'Valider'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.adsPanel}>
            {profileData.ads.length === 0 ? (
              <p className={styles.adsPanel__empty}>Vous n&apos;avez aucune annonce pour le moment.</p>
            ) : (
              <div className={styles.adsList}>
                {profileData.ads.map((ad) => {
                  const coverUrl = resolveCoverUrl(ad.imageUrl);
                  const titleText = ad.title?.trim() || "Titre de l'annonce";
                  const artist = ad.artistName?.trim() || "Nom de l'artiste";
                  const category = ad.categoryName?.trim() || 'Style de musique';
                  const city = ad.city?.trim() || 'Localisation';
                  const price =
                    typeof ad.price === 'number'
                      ? priceFormatter.format(ad.price)
                      : 'Prix EUR';

                  return (
                    <article key={ad.id} className={styles.listingCard}>
                      <div className={styles.listingCard__media}>
                        <div className={styles.listingCard__coverStack}>
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={titleText}
                              width={96}
                              height={96}
                              unoptimized
                              className={styles.listingCard__image}
                            />
                          ) : (
                            <div className={styles.listingCard__fallback} aria-hidden="true" />
                          )}
                        </div>
                      </div>

                      <div className={styles.listingCard__content}>
                        <div className={styles.listingCard__header}>
                          <h2 className={styles.listingCard__title}>{titleText}</h2>
                          <p className={styles.listingCard__price}>{price}</p>
                        </div>

                        <div className={styles.listingCard__details}>
                          <div className={styles.listingCard__metaGroup}>
                            <p className={styles.listingCard__meta}>{artist}</p>
                            <p className={styles.listingCard__meta}>{category}</p>
                            <p className={styles.listingCard__meta}>{city}</p>
                          </div>
                        </div>

                        <div className={styles.listingCard__aside}>
                          <DeleteAdForm adId={ad.id} title={titleText} />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
