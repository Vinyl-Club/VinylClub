'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API } from '@/lib/env';

type State = { error: string };
console.log(API);

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
    console.log(data);
    // 👇 adapte selon ce que ton backend renvoie (ex: accessToken / token)
    const token = data.accessToken;
    console.log(token);

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