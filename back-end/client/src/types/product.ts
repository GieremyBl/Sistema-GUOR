export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size?: string[];
  color?: string[];
  rating?: number;
  reviews?: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  size?: string;
  color?: string;
  search?: string;
}
