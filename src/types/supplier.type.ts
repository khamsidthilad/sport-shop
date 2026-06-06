import type { Product } from '@/types/product.type';

export interface Supplier {
  sup_id: number;
  name: string | null;
  Tel: string | null;
  address: string | null;
  pro_id: number | null;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface GetSuppliersResponse {
  success: boolean;
  data: Supplier[];
}

export interface GetSupplierResponse {
  success: boolean;
  data: Supplier;
}

export interface CreateSupplierInput {
  name: string;
  Tel?: string;
  address?: string;
  pro_id?: number | null;
}

export interface UpdateSupplierInput {
  sup_id: number;
  name?: string;
  Tel?: string;
  address?: string;
  pro_id?: number | null;
}

export type SupplierMutationResponse = GetSupplierResponse;

export interface DeleteSupplierResponse {
  success: boolean;
  message?: string;
}
