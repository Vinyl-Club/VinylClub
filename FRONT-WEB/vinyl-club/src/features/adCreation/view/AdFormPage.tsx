'use client';

import { useActionState, useState } from 'react';
import styles from './AdFormPage.module.css';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Select from '@/components/ui/Select/Select';
import Textarea from '@/components/ui/Textarea/Textarea';
import { Camera } from 'lucide-react';
import { Euro } from 'lucide-react';
import { useAdForm } from '../useAdForm';
import { createAdAction } from '../actions.server';
import type { State } from '../types';
import adFormSchema from '../schemas/adForm.schema';

const initialState: State = {
  fieldErrors: {},
  formError: '',
};

export default function AdFormPage() {
  const { categories } = useAdForm();
  const [stateForm, formAction, isPending] = useActionState(createAdAction, initialState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

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
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);

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

    const result = adFormSchema.safeParse(values);

    if (!result.success) {
      e.preventDefault();

      const errors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !errors[field]) {
          errors[field] = issue.message;
        }
      }

      setClientErrors(errors);
      return;
    }

    setClientErrors({});
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Ajouter une annonce
      </h1>

      <form className={styles.containerForm} action={formAction} onSubmit={handleSubmit}>
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
          <span>Importer vos images</span>
          <button type="button" className={styles.buttonImage}>
            <Camera />
          </button>
        </div>

        <Select
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
          label="Etat"
          id="etat"
          name="etat"
          placeholder="Etat du produit"
          options={[
            { value: 'TRES_BON_ETAT', label: 'Très bon état' },
            { value: 'BON_ETAT', label: 'Bon état' },
            { value: 'MAUVAIS_ETAT', label: 'Mauvais état' },
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
          label="Format"
          id="format"
          name="format"
          placeholder="Choisissez le format"
          options={[
            { value: 'T33', label: '33 Tours ' },
            { value: 'T45', label: '45 Tours ' },
            { value: 'T78', label: '78 Tours ' },
          ]}
          error={backFrontErrors.format}
        />

        {stateForm.formError && (
          <p role="alert" className={styles.error}>
            {stateForm.formError}
          </p>
        )}

        <div className={styles.cta}>
          <Button
            type="submit"
            variant="primary"
            fullWidth={false}
            isLoading={isPending}
          >
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
}