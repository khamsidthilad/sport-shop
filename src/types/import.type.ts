import type { Product } from '@/types/product.type';
import type { Supplier } from '@/types/supplier.type';

export interface ImportUser {
  User_id: string;
  Full_Name: string | null;
  Email: string | null;
  role?: string;
}

export interface ImportRecord {
  Purchase_id: number;
  user_id: string | null;
  pro_id: number | null;
  sup_id: number | null;
  quantity: number | null;
  price: number | string | null;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  supplier?: Supplier;
  user?: ImportUser;
}

export interface GetImportsResponse {
  success: boolean;
  data: ImportRecord[];
  message?: string;
}

export interface ImportMutationResponse {
  success: boolean;
  data: ImportRecord;
  message?: string;
}

export interface DeleteImportResponse {
  success: boolean;
  message?: string;
}

export interface CreateImportInput {
  pro_id: number;
  sup_id: number;
  quantity: number;
  price: number;
}

export function getImportPrice(record: ImportRecord): number {
  return Number(record.price ?? 0);
}

export function getImportTotal(record: ImportRecord): number {
  return (record.quantity ?? 0) * getImportPrice(record);
}
