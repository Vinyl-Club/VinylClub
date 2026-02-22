'use client';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './LoginForm.module.css';
import Link from 'next/link';
import { loginAction } from '@/features/auth/actions.server';
import { useActionState } from 'react';

const initialState = { error: '' };

export default function LoginForm() {

  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Bienvenue sur
        <span>Vinyl.Club</span>
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
          autoComplete="current-password"
        />

        {state?.error && (
          <p role="alert" className={styles.error}>
            {state.error}
          </p>
        )}

        <div className={styles.containerLinks}>
          <Link href='/register'>S&apos;inscrire</Link>
          <Link href=''>Mot de passe oublié</Link>
        </div>

        <div className={styles.cta}>
          <Button type="submit" variant="primary" fullWidth={false} isLoading={false}>
            Se connecter
          </Button>
        </div>
      </form>

    </div>
  );
}