// import {API} from '@/lib/env';
// import {Product, ProductImage} from './types';

// export async function catalog(){
//     const res = await fetch(`${API.product}`, {
//         cache : 'no-store',
//         method : 'GET',
//         headers : {
//             'Content-Type' : 'application/json',
//             Accept : 'application/json',
//         },
//     });
//     if(!res.ok){
//         throw new Error(`HTTP ${res.status}`);
//     }

//     const json = await res.json();
//     let items: Product[];
//     if(Array.isArray(json)) {
//         items = json as Product[];
//     }else if (json && Array.isArray(json.items)){
//         items = json.items as Product[];
//     }else{
//         items = [];
//     }

//     return items
// }

// src/features/catalog/api.ts

import { API } from '@/lib/env';
import type { Product } from './types';

type Page<T> = { content: T[] }; // définition minimale

export async function catalog(): Promise<Product[]> {
  const res = await fetch(`${API.product}`, {
    cache: 'no-store',
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  let items: Product[];
  if (Array.isArray(json)) {
    // Réponse = tableau brut
    items = json as Product[];
  } else if (json && Array.isArray(json.items)) {
    // Réponse = { items: [...] }
    items = json.items as Product[];
  } else if (json && Array.isArray((json as Page<Product>).content)) {
    // Réponse Spring Data = { content: [...] }
    items = (json as Page<Product>).content;
  } else {
    items = [];
  }

  return items;
}

