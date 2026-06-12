import { describe, expect, it } from 'vitest';
import loginSchema from './login.schema';

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'vinyl@example.com',
      password: 'motdepasse-solide',
    });

    expect(result.success).toBe(true);
  });

  it('returns the required message when email is empty', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'motdepasse-solide',
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error('Expected schema validation to fail');
    }

    expect(result.error.issues[0]?.message).toBe('Email obligatoire.');
  });

  it('returns the required message when password is empty', () => {
    const result = loginSchema.safeParse({
      email: 'vinyl@example.com',
      password: '',
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error('Expected schema validation to fail');
    }

    expect(result.error.issues[0]?.message).toBe('Mot de passe obligatoire.');
  });
});
