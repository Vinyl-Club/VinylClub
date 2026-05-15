'use client';

import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './RegisterForm.module.css';
import { registerAction } from '@/features/auth/actions.server';
import { useActionState, useState } from 'react';
import registerSchema from '@/features/auth/schemas/register.schema';

type State = {
  fieldErrors: Record<string, string>;
  formError: string;
};

const initialState: State = { fieldErrors: {}, formError: '' };

export default function RegisterForm() {
  const [state, formAction, ispending] = useActionState(registerAction, initialState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const fe = state?.fieldErrors ?? {};

  const backFrontErrors = {
    email: clientErrors.email ?? fe.email,
    password: clientErrors.password ?? fe.password,
    confirmPassword: clientErrors.confirmPassword ?? fe.confirmPassword,
    lastName: clientErrors.lastName ?? fe.lastName,
    firstName: clientErrors.firstName ?? fe.firstName,
    city: clientErrors.city ?? fe.city,
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);

    const values = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      firstName: String(formData.get('firstName') ?? ''),
      city: String(formData.get('city') ?? ''),
    };

    const result = registerSchema.safeParse(values);

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
    <div className={styles['register-form']}>
      <h1 className={styles['register-form__title']}>Insciption</h1>

      <form
        className={styles['register-form__form']}
        action={formAction}
        onSubmit={handleSubmit}
      >
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Email@.fr"
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
          autoComplete="new-password"
          error={backFrontErrors.password}
        />

        <Input
          label="Confirmation mot de passe"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirmez votre mot de passe"
          required
          autoComplete="new-password"
          error={backFrontErrors.confirmPassword}
        />

        <Input
          label="Nom"
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Nom"
          required
          autoComplete="family-name"
          error={backFrontErrors.lastName}
        />

        <Input
          label="Prénom"
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Prénom"
          required
          autoComplete="given-name"
          error={backFrontErrors.firstName}
        />

        <Input
          label="Ville"
          id="city"
          name="city"
          type="text"
          placeholder="Ville"
          required
          autoComplete="city"
          error={backFrontErrors.city}
        />


        {state?.formError && (
          <p role="alert" className={styles['register-form__error']}>
            {state.formError}
          </p>
        )}

        <div className={styles['register-form__actions']}>
          <Button type="submit" variant="primary" fullWidth={false} isLoading={ispending}>
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
}
