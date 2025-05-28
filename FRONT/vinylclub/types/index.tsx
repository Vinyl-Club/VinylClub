// types/index.ts
// Interface defining the structure of a Category object
export interface Categories {
    id: string; // Unique identifier for the category
    name: string; // Name of the category
}
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number; // BigDecimal → number
    quantity: number;
    releaseYear: number;
    status: string;
    state: string;
    userId: number;

    artist: Artist;
    category: Categories;
    album: Album

    imageUrls: string[];

    createdAt: string;  // ISO string si tu les envoies en JSON (Timestamp → string)
    updatedAt: string;
}
export interface Artist {
    id: number;
    name: string;
}

export interface Album {
    id: number;
    name: string;
}

// Interface pour la réponse de l'API (si votre API wrappe les données)
export interface ApiResponse<T> {
    data: T;
    success?: boolean;
    message?: string;
    error?: string;
}

// Type pour les erreurs d'API
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}