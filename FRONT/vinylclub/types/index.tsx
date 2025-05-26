// types/index.ts
// Interface defining the structure of a Category object
export interface Categories {
    id: string; // Unique identifier for the category
    name: string; // Name of the category
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