import type { Product } from'../types.ts';
import Image from 'next/image';

export default function CatalogView({ items }: { items: Product[] }) {
    if (!items || items.length === 0) {
        return <p>Aucun produit pour le moment.</p>;
    }

    return (
    <ul style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))' }}>
        {items.map((p) => {
            let coverUrl: string | undefined = undefined;
            if (p.images && p.images.length > 0 && p.images[0] && p.images[0].imageUrl) {
            coverUrl = p.images[0].imageUrl; // on prend la première image telle quelle
            }

            return (
            <li key={p.id} style={{ border:'1px solid #eee', borderRadius:8, padding:12 }}>
                <Image
                    src={coverUrl ?? '/placeholder.png'}
                    alt={p.title}
                    width={220}
                    height={160}
                    style={{ width:'100%', height:160, objectFit:'cover', marginBottom:8 }}
                />
                <div style={{ fontWeight:600 }}>{p.title}</div>
                <div>{p.price} €</div>
            </li>
            );
        })}
        </ul>
    );
}