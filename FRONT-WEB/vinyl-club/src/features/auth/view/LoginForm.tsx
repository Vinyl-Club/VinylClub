'use client';

import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './LoginForm.module.css';
import Link from 'next/link';
import { loginAction } from '@/features/auth/actions.server';
import { useActionState, useState } from 'react';
import loginSchema from '@/features/auth/schemas/login.schema';

type State = {
  fieldErrors: Record<string, string>;
  formError: string;
};

const initialState: State = { fieldErrors: {}, formError: '' };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const fe = state?.fieldErrors ?? {};

  const backFrontErrors = {
    email: clientErrors.email ?? fe.email,
    password: clientErrors.password ?? fe.password,
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);

    const values = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    const result = loginSchema.safeParse(values);

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
    <div className={styles['login-form']}>
      <h1 className={styles['login-form__title']}>
        Bienvenue sur
        <span className={styles['login-form__brand']}>Vinyl.Club</span>
      </h1>

      <form className={styles['login-form__form']} action={formAction} onSubmit={handleSubmit}>
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Email@"
          required
          autoComplete="email"
          error={backFrontErrors.email}
        />

        <Input
          label="Mot de passe"
          id="password"
          name="password"
          type="password"
          placeholder="Mot de passe"
          required
          autoComplete="current-password"
          error={backFrontErrors.password}
        />

        {state?.formError && (
          <p role="alert" className={styles['login-form__error']}>
            {state.formError}
          </p>
        )}

        <div className={styles['login-form__links']}>
          <Link href="/register" className={styles['login-form__link']}>
            S&apos;inscrire
          </Link>
          <Link href="" className={styles['login-form__link']}>
            Mot de passe oublié
          </Link>
        </div>

        <div className={styles['login-form__actions']}>
          <Button type="submit" variant="primary" fullWidth={false} isLoading={isPending}>
            Se connecter
          </Button>
        </div>
      </form>
    </div>
  );
}
