import type { GetAllProductsResponse, Product } from '@/types/product.type';
import { api } from './api';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<GetAllProductsResponse>('/products');
    if (!data.success) throw new Error('Failed to load products');
    return data.data;
  },
};
