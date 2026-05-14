'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Euro } from 'lucide-react';
import styles from './AdFormPage.module.css';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Select from '@/components/ui/Select/Select';
import Textarea from '@/components/ui/Textarea/Textarea';
import { useAdForm } from '../useAdForm';
import { createAdAction } from '../actions.server';
import type { State } from '../types';
import adFormSchema from '../schemas/adForm.schema';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialState: State = {
  fieldErrors: {},
  formError: '',
  successMessage: '',
};

export default function AdFormPage() {
  const { categories } = useAdForm();
  const [stateForm, formAction, isPending] = useActionState(createAdAction, initialState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectResetKey, setSelectResetKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fe = stateForm?.fieldErrors ?? {};

  const backFrontErrors = {
    titre: clientErrors.titre ?? fe.titre,
    artiste: clientErrors.artiste ?? fe.artiste,
    album: clientErrors.album ?? fe.album,
    style: clientErrors.style ?? fe.style,
    description: clientErrors.description ?? fe.description,
    etat: clientErrors.etat ?? fe.etat,
    prix: clientErrors.prix ?? fe.prix,
    format: clientErrors.format ?? fe.format,
    images: clientErrors.images ?? fe.images,
  };

  useEffect(() => {
    if (!stateForm.successMessage) {
      return;
    }

    formRef.current?.reset();
    setSelectedImages([]);
    setClientErrors({});
    setSelectResetKey((prev) => prev + 1);

    if (fileInputRef.current) {
      const dt = new DataTransfer();
      fileInputRef.current.files = dt.files;
    }
  }, [stateForm.successMessage]);

  function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.currentTarget.files ?? []);

    const mergedFiles = [...selectedImages];

    for (const file of newFiles) {
      const alreadyExists = mergedFiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified,
      );

      if (!alreadyExists) {
        mergedFiles.push(file);
      }
    }

    setSelectedImages(mergedFiles);

    const dt = new DataTransfer();
    for (const file of mergedFiles) {
      dt.items.add(file);
    }

    event.currentTarget.files = dt.files;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const values = {
      titre: String(formData.get('titre') ?? ''),
      artiste: String(formData.get('artiste') ?? ''),
      album: String(formData.get('album') ?? ''),
      style: String(formData.get('style') ?? ''),
      description: String(formData.get('description') ?? ''),
      etat: String(formData.get('etat') ?? ''),
      prix: String(formData.get('prix') ?? ''),
      format: String(formData.get('format') ?? ''),
    };

    const errors: Record<string, string> = {};
    const result = adFormSchema.safeParse(values);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !errors[field]) {
          errors[field] = issue.message;
        }
      }
    }

    if (selectedImages.some((file) => !file.type.startsWith('image/'))) {
      errors.images = 'Veuillez selectionner uniquement des images.';
    } else if (selectedImages.some((file) => file.size > MAX_IMAGE_SIZE)) {
      errors.images = 'Chaque image doit faire moins de 5 Mo.';
    }

    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
  }

  return (
    <div className={styles['ad-form']}>
      <h1 className={styles['ad-form__title']}>Ajouter une annonce</h1>

      <form
        ref={formRef}
        className={styles['ad-form__form']}
        action={formAction}
        onSubmit={handleSubmit}
      >
        <Input
          label="Titre"
          id="titre"
          name="titre"
          placeholder="Ex: Vends..."
          autoComplete="off"
          error={backFrontErrors.titre}
          labelClassName={styles['ad-form__field-label']}
        />

        <Input
          label="Artiste"
          id="artiste"
          name="artiste"
          placeholder="Ajouter le nom de l'artiste"
          autoComplete="off"
          error={backFrontErrors.artiste}
          labelClassName={styles['ad-form__field-label']}
        />

        <Input
          label="Album"
          id="album"
          name="album"
          placeholder="Ajouter le nom de l'album"
          autoComplete="off"
          error={backFrontErrors.album}
          labelClassName={styles['ad-form__field-label']}
        />

        <div className={styles['ad-form__upload-panel']}>
          <div className={styles['ad-form__upload-row']}>
            <div className={styles['ad-form__upload-info']}>
              <span className={styles['ad-form__field-label']}>Importer vos images</span>
              <span className={styles['ad-form__upload-hint']}>
                PNG ou JPG, 5 Mo max par image.
              </span>
              {selectedImages.length > 0 && (
                <span className={styles['ad-form__upload-count']}>
                  {selectedImages.length} fichier(s) selectionne(s)
                </span>
              )}
            </div>

            <button
              type="button"
              className={styles['ad-form__upload-button']}
              aria-label="Choisir des images"
              onClick={() => fileInputRef.current?.click()}
            >
              Choisir des images
            </button>

            <input
              ref={fileInputRef}
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              className={styles['ad-form__file-input']}
              onChange={handleImagesChange}
            />
          </div>

          {selectedImages.length > 0 ? (
            <ul className={styles['ad-form__image-list']}>
              {selectedImages.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
              ))}
            </ul>
          ) : (
            <p className={styles['ad-form__upload-empty']}>
              Aucun fichier selectionne pour le moment.
            </p>
          )}
        </div>

        {backFrontErrors.images && (
          <p role="alert" className={styles['ad-form__error']}>
            {backFrontErrors.images}
          </p>
        )}

        <Select
          key={`style-${selectResetKey}`}
          label="Style de musique"
          id="style"
          name="style"
          placeholder="Choisissez le style"
          options={categories.map((category) => ({
            value: String(category.id),
            label: category.name,
          }))}
          error={backFrontErrors.style}
          labelClassName={styles['ad-form__field-label']}
        />

        <Textarea
          label="Description"
          id="description"
          name="description"
          placeholder="Ajouter une description"
          error={backFrontErrors.description}
          labelClassName={styles['ad-form__field-label']}
        />

        <Select
          key={`etat-${selectResetKey}`}
          label="Etat"
          id="etat"
          name="etat"
          placeholder="Etat du produit"
          options={[
            { value: 'TRES_BON_ETAT', label: 'Tres bon etat' },
            { value: 'BON_ETAT', label: 'Bon etat' },
            { value: 'MAUVAIS_ETAT', label: 'Mauvais etat' },
          ]}
          error={backFrontErrors.etat}
          labelClassName={styles['ad-form__field-label']}
        />

        <div className={styles['ad-form__price-field']}>
          <Input
            label="Prix"
            id="prix"
            name="prix"
            placeholder="Ajouter un prix"
            autoComplete="off"
            error={backFrontErrors.prix}
            labelClassName={styles['ad-form__field-label']}
          />
          <Euro className={styles['ad-form__euro-icon']} />
        </div>

        <Select
          key={`format-${selectResetKey}`}
          label="Format"
          id="format"
          name="format"
          placeholder="Choisissez le format"
          options={[
            { value: 'T33', label: '33 Tours' },
            { value: 'T45', label: '45 Tours' },
            { value: 'T78', label: '78 Tours' },
          ]}
          error={backFrontErrors.format}
          labelClassName={styles['ad-form__field-label']}
        />

        {stateForm.successMessage && (
          <p role="status" className={styles['ad-form__success']}>
            {stateForm.successMessage}
          </p>
        )}

        {stateForm.formError && (
          <p role="alert" className={styles['ad-form__error']}>
            {stateForm.formError}
          </p>
        )}

        <div className={styles['ad-form__actions']}>
          <Button type="submit" variant="primary" fullWidth={false} isLoading={isPending}>
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
}
