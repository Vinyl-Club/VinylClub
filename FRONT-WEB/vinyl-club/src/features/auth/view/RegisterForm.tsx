'use client';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './RegisterForm.module.css';
import { registerAction } from '@/features/auth/actions.server';
import { useActionState } from 'react';

const initialState = { error: ''};

export default function RegisterForm() {

    const [state, formAction] = useActionState(registerAction, initialState);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Insciption
            </h1>

            <form className={styles.containerForm} action={formAction}>
              
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
                    autoComplete="new-password"
                />

                <Input 
                    label="Confirmation mot de passe"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    required
                    autoComplete="new-password"
                />
                
                <Input
                    label="Nom"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Nom"
                    required
                    autoComplete="family-name"
                />

                <Input
                    label="Prénom"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Prénom"
                    required
                    autoComplete="given-name"
                />

                {state?.error && (
                    <p role='alert' className={styles.error}>
                        {state.error}
                    </p>
                )}

                <div className={styles.cta}>
                    <Button type="submit" variant="primary" fullWidth={false} isLoading={false}>
                        Valider
                    </Button>
                </div>
            </form>
        </div>
    );
}