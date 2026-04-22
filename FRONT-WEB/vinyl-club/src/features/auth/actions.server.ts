'use server';

import { redirect } from 'next/navigation';
import { API } from '@/lib/env';
import {setAuthCookie, clearAuthCookie} from '@/lib/auth.Server'

type State = {
  fieldErrors: Record<string, string>;
  formError: string;
};

// const initialState: State = { fieldErrors: {}, formError: '' };

export async function loginAction(prevState: State, formData: FormData): Promise<State> {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    let response: Response;

    try {
        response = await fetch(API.auth, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            cache: 'no-store',
        });
    } catch (error) {
        console.error('Login request failed:', error);
        return { fieldErrors: {}, formError: 'Connexion impossible : backend indisponible.' };
    }

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
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    
    if (!accessToken || !refreshToken) {
        return {fieldErrors:{}, formError: 'Réponse backend invalide (token manquant)' };
    }


    await setAuthCookie(accessToken, refreshToken, data.user);

    redirect('/catalog');
}

export async function registerAction(prevState: State, formData: FormData): Promise<State> {
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

    let response: Response;

    try {
        response = await fetch(API.register, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, lastName, firstName }),
            cache: 'no-store',
        });
    } catch (error) {
        console.error('Register request failed:', error);
        return { fieldErrors: {}, formError: 'Inscription impossible : backend indisponible.' };
    }

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

        return { fieldErrors: {}, formError: raw || 'Une erreur est survenue.' };
    }

    const data = await response.json();
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    if(!accessToken || !refreshToken) {
        return {fieldErrors: {}, formError: 'Token manquant'}
    }

    await setAuthCookie(accessToken, refreshToken, data.user);

    redirect('/catalog');
}

export async function logoutAction() {
  await clearAuthCookie()
   redirect('/login');
}
