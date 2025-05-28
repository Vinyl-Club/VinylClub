export interface Vinyl {
  id: string;
  title: string;
  artist: string;
  genre: string;
  price: number;
  imageUrl: string;
  description: string;
  releaseYear: number;
  label: string;
  condition: 'Mint' | 'Near Mint' | 'Very Good+' | 'Very Good' | 'Good+' | 'Good';
  inStock: boolean;
  quantity?: number;
}

export interface CartItem extends Vinyl {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}