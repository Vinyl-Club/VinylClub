import styles from './AdFormPage.module.css'
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Select from '@/components/ui/Select/Select';
import Textarea from '@/components/ui/Textarea/Textarea';
import { Camera } from 'lucide-react';
import { Euro } from 'lucide-react';

<Euro />

export default function AdFormPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Ajouter une annonce
            </h1>

            <form className={styles.containerForm} action="">
                <Input
                    label="Artiste"
                    id="artiste"
                    name="artiste"
                    // type="artiste"
                    placeholder="Ajouter le nom de l'artiste"
                    // required
                    autoComplete="artiste"
                />

                <Input
                    label="Album"
                    id="album"
                    name="album"
                    // type="album"
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
                    options={[
                        { value: "rock", label: "Rock" },
                        { value: "jazz", label: "Jazz" },
                        { value: "electro", label: "Electro" },
                        { value: "hiphop", label: "Hip-Hop" },
                    ]}
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
                        { value: "MINT", label: "Comme neuf" },
                        { value: "VERY_GOOD", label: "Très bon état" },
                        { value: "GOOD", label: "Bon état" },
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
                        { value: "LP", label: "33T " },
                        { value: "EP", label: "45T " },
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