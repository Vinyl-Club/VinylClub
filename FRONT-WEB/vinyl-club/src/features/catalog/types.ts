export interface ProductImage {
    id: number;
    ProductId: number;
    imageUrl: string;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;          // BigDecimal côté Java → number côté TS
    quantity: number;
    releaseYear: number;
    status: string;
    state: string;
    userId: number;
    images: ProductImage[];
    }