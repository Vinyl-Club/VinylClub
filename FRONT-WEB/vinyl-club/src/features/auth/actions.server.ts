'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API } from '@/lib/env';

type State = { error: string };

export async function loginAction(prevState: State, formData: FormData): Promise<State> {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
        return { error: 'Email et mot de passe requis' };
    }

    const response = await fetch(API.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
    });

    if (!response.ok) {
        return { error: 'Identifiants incorrects' };
    }

    const data = await response.json();
    const token = data.accessToken;

    if (!token) {
        return { error: 'Réponse backend invalide (token manquant)' };
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
    const email = String(formData.get('email') ?? ``);
    const password = String(formData.get('password') ?? ``);
    const confirmPassword = String(formData.get('confirmPassword') ?? ``);
    const lastName = String(formData.get('lastName') ?? ``);
    const firstName = String(formData.get('firstName') ?? ``);

    console.log(password);
    console.log(confirmPassword)

    if(!email || !password || !confirmPassword || !lastName || !firstName) {
        return {error: 'Tous les champs sont requis.'}
    }

    if(password !== confirmPassword) {
        return {error: 'Les mots de passe sont différents.'}
    }

    const response = await fetch(API.register, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, lastName, firstName }),
        cache: 'no-store',
    });

    if(!response.ok) {
        try{
            const errorData = await response.json();

            if(typeof errorData === 'object' && errorData !== null) {
                const errorMessage = Object.values(errorData);

                if(errorMessage.length > 0) {
                    return {error: String(errorMessage[0])}
                }
            }
            return {error: "Erreur de validation"};
        }catch(e) {
            const message = await response.text();
            return {error: message || "Une erreur est survenue."};
        }
    }

    const data = await response.json();
    const token = data.accessToken;

    if(!token) {
        return {error: 'Token manquant'}
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