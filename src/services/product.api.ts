import type { GetAllProductsResponse, Product } from '@/types/product.type';
import type { CreateProductInput, CreateProductResponse } from '@/types/createPro';
import { api } from './api';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<GetAllProductsResponse>('/products/all');
    if (!data.success) throw new Error('Failed to load products');
    return data.data;
  },

  create: async (input: CreateProductInput): Promise<Product> => {
    const formData = new FormData();
    formData.append('pro_name', input.pro_name);
    formData.append('pro_detail', input.pro_detail);
    formData.append('pro_price', input.pro_price);
    formData.append('pro_qty', String(input.pro_qty));
    formData.append('cate_id', String(input.cate_id));
    formData.append('brand_id', String(input.brand_id));
    formData.append('pro_image', input.pro_image);

    const { data } = await api.post<CreateProductResponse>('/products/create', formData);
    if (!data.success) throw new Error('Failed to create product');
    return data.data;
  },
  
 
};

