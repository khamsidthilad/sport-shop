import type { CreateProductData } from '@/types/createPro';
import type { Category } from '@/types/category.type';
import type { Brand } from '@/types/brand.type';
import { normalizeProductImage } from '@/utils/getProductImageUrl';

export type { Category, Brand };

export interface GetAllProductsResponse {
  success: boolean
  data: Product[]
}

export interface GetProductResponse {
  success: boolean
  data: Product
}

export interface DeleteProductResponse {
  success: boolean
  message?: string
}

export interface Product {
  pro_id: number
  pro_name?: string
  pro_detail?: string
  pro_price?: string
  pro_image?: string
  pro_qty: number
  cate_id?: number
  brand_id?: number
  createdAt: string
  updatedAt: string
  category?: Category
  brand?: Brand
}

/** Normalize create-product API payload into app Product shape */
export function toProduct(data: CreateProductData): Product {
  return {
    pro_id: data.pro_id,
    pro_name: data.pro_name,
    pro_detail: data.pro_detail,
    pro_price: data.pro_price,
    pro_qty: Number(data.pro_qty),
    pro_image: normalizeProductImage(data.pro_image),
    cate_id: Number(data.cate_id),
    brand_id: Number(data.brand_id),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}



