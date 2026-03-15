'use client';

import styles from './AdFormPage.module.css'
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Select from '@/components/ui/Select/Select';
import Textarea from '@/components/ui/Textarea/Textarea';
import { Camera } from 'lucide-react';
import { Euro } from 'lucide-react';
import { useAdForm } from '../useAdForm';



export default function AdFormPage() {
    const {categories} = useAdForm();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Ajouter une annonce
            </h1>

            <form className={styles.containerForm} action="">
                <Input
                    label="Titre"
                    id="titre"
                    name="titre"
                    // type="text"
                    placeholder="Ex: Vends..."
                    // required
                    autoComplete="artiste"
                />

                <Input
                    label="Artiste"
                    id="artiste"
                    name="artiste"
                    // type="text"
                    placeholder="Ajouter le nom de l'artiste"
                    // required
                    autoComplete="artiste"
                />

                <Input
                    label="Album"
                    id="album"
                    name="album"
                    // type="text"
                    placeholder="Ajouter le nom de l'album"
                    // required
                    autoComplete="album"
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
                />
                
                <Textarea
                    label="Description"
                    id="description"
                    name="description"
                    placeholder="Ajouter une description"
                />

                <Select
                    label="Etat"
                    id="etat"
                    name="etat"
                    placeholder="Etat du produit"
                    options={[
                        { value: "TRES_BON_ETAT", label: "Très bon état" },
                        { value: "BON_ETAT", label: "Bon état" },
                        { value: "MAUVAISE_ETAT", label: "Mauvais état" },
                    ]}
                />

                <div className={styles.priceWrapper}>
                    <Input
                        label="Prix"
                        id="prix"
                        name="prix"
                        placeholder="Ajouter un prix"
                        autoComplete="prix"
                    />
                    <Euro className={styles.euroIcon} />
                </div>

                <Select
                    label="Format"
                    id="format"
                    name="format"
                    placeholder="Choisissez le format"
                    options={[
                        { value: "T33", label: "33 Tours " },
                        { value: "T45", label: "45 Tours " },
                        { value: "T78", label: "78 Tours " },
                    ]}
                />

                <div className={styles.cta}>
                    <Button type="submit" variant="primary" fullWidth={false} isLoading={false}>
                        Valider
                    </Button>
                </div>
            </form>
        </div>
    )
}