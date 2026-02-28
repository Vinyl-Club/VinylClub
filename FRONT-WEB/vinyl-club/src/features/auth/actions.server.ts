'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API } from '@/lib/env';

type State = {
  fieldErrors: Record<string, string>;
  formError: string;
};

// const initialState: State = { fieldErrors: {}, formError: '' };

export async function loginAction(prevState: State, formData: FormData): Promise<State> {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const response = await fetch(API.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
    });

    if (!response.ok) {
        const raw = await response.text();

        try {
            const parsed: unknown = raw ? JSON.parse(raw) : null;

            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return { fieldErrors: parsed as Record<string, string>, formError: '' };
            }
        } catch {
        // pas JSON
        }
        return { fieldErrors: {}, formError: raw || 'Identifiants incorrects' };
    }

    const data = await response.json();
    const token = data.accessToken;

    if (!token) {
        return {fieldErrors:{}, formError: 'Réponse backend invalide (token manquant)' };
    }

    const cookieStore = await cookies();
    cookieStore.set('auth', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    redirect('/catalog');
}

export async function registerAction(prevState: State, formData: FormData): Promise<State> {
    console.log("rezet");
    const email = String(formData.get('email') ?? ``);
    const password = String(formData.get('password') ?? ``);
    const confirmPassword = String(formData.get('confirmPassword') ?? ``);
    const lastName = String(formData.get('lastName') ?? ``);
    const firstName = String(formData.get('firstName') ?? ``);
    
    if(password !== confirmPassword) {
        return {
            fieldErrors: {confirmPassword: "Les mots de passe sont différents."},
            formError: '',
        }
    }

    const response = await fetch(API.register, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, lastName, firstName }),
        cache: 'no-store',
    });

    if (!response.ok) {
        const raw = await response.text();

        try {
            const parsed: unknown = raw ? JSON.parse(raw) : null;

            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return { fieldErrors: parsed as Record<string, string>, formError: '' };
            }
            } catch {
        // pas JSON
        }

        // 2) Erreur globale texte (ex: "Email déjà pris")
        return { fieldErrors: {}, formError: raw || 'Une erreur est survenue.' };
    }

    const data = await response.json();
    const token = data.accessToken;

    if(!token) {
        return {fieldErrors: {}, formError: 'Token manquant'}
    }

     const cookieStore = await cookies();
    cookieStore.set('auth', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    redirect('/catalog');
}