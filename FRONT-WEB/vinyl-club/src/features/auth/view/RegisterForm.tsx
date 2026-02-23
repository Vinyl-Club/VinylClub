'use client';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './RegisterForm.module.css';


export default function RegisterForm() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Insciption
            </h1>

            <form className={styles.containerForm} action="">
              
                <Input 
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email@.fr"
                    required
                    autoComplete="email"
                />
                    
                <Input
                    label="Mot de passe"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    required
                    autoComplete="current-password"
                />

                <Input 
                    label="Confirmation mot de passe"
                    id="Confirm password"
                    name="Confirm password"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    required
                    autoComplete="current-password"
                />
                
                <Input
                    label="Nom"
                    id="Lastname"
                    name="Lastnamee"
                    type="Lastname"
                    placeholder="Nom"
                    required
                    autoComplete="lastname"
                />

                <Input
                    label="Prénom"
                    id="Firstname"
                    name="Firstname"
                    type="Firstname"
                    placeholder="Prénom"
                    required
                    autoComplete="firstname"
                />

                <div className={styles.cta}>
                    <Button type="submit" variant="primary" fullWidth={false} isLoading={false}>
                        Valider
                    </Button>
                </div>
            </form>
        </div>
    );
}