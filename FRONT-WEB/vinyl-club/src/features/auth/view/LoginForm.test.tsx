import React, { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type LoginFormState = {
  fieldErrors: Record<string, string>;
  formError: string;
};

const { mockFormAction, mockUseActionState } = vi.hoisted(() => ({
  mockFormAction: vi.fn(),
  mockUseActionState: vi.fn(),
}));

vi.mock('@/features/auth/actions.server', () => ({
  loginAction: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');

  return {
    ...actual,
    useActionState: (...args: unknown[]) => mockUseActionState(...args),
  };
});

import LoginForm from './LoginForm';

function setActionState(state: LoginFormState, isPending = false) {
  mockUseActionState.mockReturnValue([state, mockFormAction, isPending]);
}

describe('LoginForm', () => {
  beforeEach(() => {
    mockFormAction.mockReset();
    mockUseActionState.mockReset();
    setActionState({ fieldErrors: {}, formError: '' });
  });

  it('renders the login fields and submit button', () => {
    render(<LoginForm />);

    expect(screen.getByRole('heading', { name: /Bienvenue sur/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  it('shows client validation errors when the form is invalid', () => {
    render(<LoginForm />);

    const form = screen.getByRole('button', { name: 'Se connecter' }).closest('form');
    const emailInput = screen.getByLabelText('Email');

    if (!form) {
      throw new Error('Login form not found');
    }

    fireEvent.change(emailInput, { target: { value: 'email-invalide' } });
    fireEvent.submit(form);

    expect(screen.getByText('Email invalide.')).toBeInTheDocument();
    expect(screen.getByText('Mot de passe obligatoire.')).toBeInTheDocument();
  });

  it('clears client validation errors when the values become valid', () => {
    render(<LoginForm />);

    const form = screen.getByRole('button', { name: 'Se connecter' }).closest('form');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');

    if (!form) {
      throw new Error('Login form not found');
    }

    fireEvent.change(emailInput, { target: { value: 'email-invalide' } });
    fireEvent.submit(form);

    expect(screen.getByText('Email invalide.')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'vinyl@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'motdepasse-solide' } });
    fireEvent.submit(form);

    expect(screen.queryByText('Email invalide.')).not.toBeInTheDocument();
    expect(screen.queryByText('Mot de passe obligatoire.')).not.toBeInTheDocument();
  });

  it('displays backend errors returned by the action state', () => {
    setActionState({
      fieldErrors: { email: 'Adresse inconnue.' },
      formError: 'Identifiants incorrects.',
    });

    render(<LoginForm />);

    expect(screen.getByText('Adresse inconnue.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Identifiants incorrects.');
  });

  it('shows the loading state while the form is pending', () => {
    setActionState({ fieldErrors: {}, formError: '' }, true);

    render(<LoginForm />);

    expect(screen.getByRole('button', { name: 'Chargement' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Chargement' })).toHaveAttribute('aria-busy', 'true');
  });
});
