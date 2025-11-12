export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: File;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface User extends AuthUser {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  total: number;
  status: string;
  createdAt: Date;
}
