// This file defines TypeScript interfaces for the data structures used in the Vinyl Club application.
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
    images: {
        id: number;
        productId: number; // ID of the product this image belongs to
        imageUrl: string; // URL of the image
    }[]; // Array of images associated with the product
  

    artist: Artist;
    category: Categories;
    album: Album

    imageUrls: string[];

    createdAt: string;  // ISO string si tu les envoies en JSON (Timestamp → string)
    updatedAt: string;

    user?: User;       // <--- ajouté
    address?: Address;
}
export interface Artist {
    id: number;
    name: string;
}

export interface Album {
    id: number;
    name: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    updatedAt: string;
    }

export type Address = {
    id: number;
    city: string;
    zipCode: string;
    country: string;
    street: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        updatedAt: string;
    };
};

// API response interface (if your API wraps the data)
export interface ApiResponse<T> {
    data: T;
    success?: boolean;
    message?: string;
    error?: string;
}

// Type for API errors
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// Type for login responseinterface 
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
    password: string;
}