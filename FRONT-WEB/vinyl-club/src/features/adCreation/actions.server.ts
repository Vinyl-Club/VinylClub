'use server';

import { API } from '@/lib/env';
import { cookies } from 'next/headers';
import type { State } from './types';

//: Promise<State>

export async function createAdAction(prevState: State, formData: FormData) {
    const title = String(formData.get('titre') ?? '');
    const artist  = String(formData.get('artiste') ?? '');
    const album = String(formData.get('album') ?? '');
    const category = String(formData.get('style') ?? '');
    const description = String(formData.get('description') ?? '');
    const state = String(formData.get('etat') ?? '');
    const price = Number(formData.get('prix') ?? '');
    const format = String(formData.get('format') ?? '');

    const cookieStore =  await cookies();
    const token = cookieStore.get('auth')?.value;

    const response =  await fetch(API.createAd, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
            title, 
            artist , 
            album, 
            category, 
            description, 
            state, 
            price, 
            format
        }),
        cache: 'no-store',
    });

    const data = await response.json();
}