'use client';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './RegisterForm.module.css';
import { registerAction } from '@/features/auth/actions.server';
import { useActionState } from 'react';

type State = {
  fieldErrors: Record<string, string>;
  formError: string;
};

const initialState: State = { fieldErrors: {}, formError: '' };

export default function RegisterForm() {
    const [state, formAction] = useActionState(registerAction, initialState);
    const fe = state?.fieldErrors ?? {};

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
                    error={fe.email}
                />
                    
                <Input
                    label="Mot de passe"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    required
                    autoComplete="new-password"
                    error={fe.password}
                />

                <Input 
                    label="Confirmation mot de passe"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    required
                    autoComplete="new-password"
                    error={fe.confirmPassword}
                />
                
                <Input
                    label="Nom"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Nom"
                    required
                    autoComplete="family-name"
                    error={fe.lastName}
                />

                <Input
                    label="Prénom"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Prénom"
                    required
                    autoComplete="given-name"
                    error={fe.firstName}
                />

                {state?.formError && (
                    <p role='alert' className={styles.error}>
                        {state.formError}
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