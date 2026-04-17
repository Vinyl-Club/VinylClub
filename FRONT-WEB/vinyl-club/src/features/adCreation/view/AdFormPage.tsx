'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Camera, Euro } from 'lucide-react';
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
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
  }, [stateForm.successMessage]);

  function handleImagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    setSelectedImages(files.map((file) => file.name));
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

    const imageFiles = formData
      .getAll('images')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (imageFiles.some((file) => !file.type.startsWith('image/'))) {
      errors.images = 'Veuillez selectionner uniquement des images.';
    } else if (imageFiles.some((file) => file.size > MAX_IMAGE_SIZE)) {
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
    <div className={styles.container}>
      <h1 className={styles.title}>Ajouter une annonce</h1>

      <form
        ref={formRef}
        className={styles.containerForm}
        action={formAction}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <Input
          label="Titre"
          id="titre"
          name="titre"
          placeholder="Ex: Vends..."
          autoComplete="off"
          error={backFrontErrors.titre}
        />

        <Input
          label="Artiste"
          id="artiste"
          name="artiste"
          placeholder="Ajouter le nom de l'artiste"
          autoComplete="off"
          error={backFrontErrors.artiste}
        />

        <Input
          label="Album"
          id="album"
          name="album"
          placeholder="Ajouter le nom de l'album"
          autoComplete="off"
          error={backFrontErrors.album}
        />

        <div className={styles.containerImage}>
          <div className={styles.imageInfo}>
            <span>Importer vos images</span>
            {selectedImages.length > 0 && (
              <span className={styles.imageCount}>
                {selectedImages.length} fichier(s) selectionne(s)
              </span>
            )}
          </div>

          <button
            type="button"
            className={styles.buttonImage}
            aria-label="Choisir des images"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera />
          </button>

          <input
            ref={fileInputRef}
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            className={styles.hiddenInput}
            onChange={handleImagesChange}
          />
        </div>

        {selectedImages.length > 0 && (
          <ul className={styles.imageList}>
            {selectedImages.map((imageName) => (
              <li key={imageName}>{imageName}</li>
            ))}
          </ul>
        )}

        {backFrontErrors.images && (
          <p role="alert" className={styles.error}>
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
        />

        <Textarea
          label="Description"
          id="description"
          name="description"
          placeholder="Ajouter une description"
          error={backFrontErrors.description}
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
        />

        <div className={styles.priceWrapper}>
          <Input
            label="Prix"
            id="prix"
            name="prix"
            placeholder="Ajouter un prix"
            autoComplete="off"
            error={backFrontErrors.prix}
          />
          <Euro className={styles.euroIcon} />
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
        />

        {stateForm.successMessage && (
          <p role="status" className={styles.success}>
            {stateForm.successMessage}
          </p>
        )}

        {stateForm.formError && (
          <p role="alert" className={styles.error}>
            {stateForm.formError}
          </p>
        )}

        <div className={styles.cta}>
          <Button type="submit" variant="primary" fullWidth={false} isLoading={isPending}>
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
}
