import { toProduct, type DeleteProductResponse, type GetAllProductsResponse, type GetProductResponse, type Product } from '@/types/product.type';
import {
  toCreateFormData,
  toUpdateFormData,
  type CreateProductInput,
  type CreateProductResponse,
  type UpdateProductInput,
  type UpdateProductResponse,
} from '@/types/createPro';
import { normalizeProductImage } from '@/utils/getProductImageUrl';
import { api } from './api';

function normalizeProduct(item: Product): Product {
  return {
    ...item,
    pro_qty: Number(item.pro_qty),
    pro_image: item.pro_image ? normalizeProductImage(item.pro_image) : undefined,
  };
}

interface CategoryProductsResponse {
  success?: boolean;
  /** Backend typo — some endpoints return `succsess` instead of `success`. */
  succsess?: boolean;
  data?: {
    products?: Product[];
  };
  message?: string;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get<GetAllProductsResponse>('/products/all');
    if (!data.success) throw new Error('Failed to load products');
    return data.data.map(normalizeProduct);
  },
  getById: async (pro_id: number): Promise<Product> => {
    const { data } = await api.get<GetProductResponse>(`/products/${pro_id}`);
    if (!data.success) throw new Error('Failed to load product');
    return normalizeProduct(data.data);
  },

  getByCateId: async (cate_id: number): Promise<Product[]> => {
    const { data } = await api.get<CategoryProductsResponse>(
      `/categories/${cate_id}/products`,
    );
    if (!data.success && !data.succsess) {
      throw new Error(data.message ?? 'Failed to load products');
    }
    const products = data.data?.products ?? [];
    return products.map(normalizeProduct);
  },
  getByBrandId: async (brand_id: number): Promise<Product[]> => {
    const { data } = await api.get<GetAllProductsResponse>(`/products/getByBrandId/${brand_id}`);
    if (!data.success) throw new Error('Failed to load products');
    return data.data.map(normalizeProduct);
  },
 
  create: async (input: CreateProductInput): Promise<Product> => {
    const { data } = await api.post<CreateProductResponse>(
      '/products/create',
      toCreateFormData(input),
    );
    if (!data.success) throw new Error('Failed to create product');
    return toProduct(data.data);
  },

  update: async (input: UpdateProductInput): Promise<Product> => {
    const { data } = await api.put<UpdateProductResponse>(
      `/products/update/${input.pro_id}`,
      toUpdateFormData(input),
    );
    if (!data.success) throw new Error('Failed to update product');
    return toProduct(data.data);
  },
  delete: async (pro_id: number): Promise<void> => {
    const { data } = await api.delete<DeleteProductResponse>(`/products/delete/${pro_id}`);
    if (!data.success) throw new Error('Failed to delete product');
  },
};
