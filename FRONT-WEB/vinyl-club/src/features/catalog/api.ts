import {API} from '@/lib/env';
import {Product, ProductImage} from './types';

export async function catalog(){
    const res = await fetch(`${API.product}`, {cache : 'no-store'});
    if(!res.ok){
        throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    let items: Product[];
    if(Array.isArray(json)) {
        items = json as Product[];
    }else if (json && Array.isArray(json.items)){
        items = json.items as Product[];
    }else{
        items = [];
    }

    return items
}
