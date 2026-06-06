import type {
  CreateSupplierInput,
  DeleteSupplierResponse,
  GetSupplierResponse,
  GetSuppliersResponse,
  Supplier,
  SupplierMutationResponse,
  UpdateSupplierInput,
} from '@/types/supplier.type';
import { api } from './api';

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await api.get<GetSuppliersResponse>('/suppliers/all');
    if (!data.success) throw new Error('Failed to load suppliers');
    return data.data;
  },

  getById: async (sup_id: number): Promise<Supplier> => {
    const { data } = await api.get<GetSupplierResponse>(`/suppliers/${sup_id}`);
    if (!data.success) throw new Error('Failed to load supplier');
    return data.data;
  },

  create: async (input: CreateSupplierInput): Promise<Supplier> => {
    const { data } = await api.post<SupplierMutationResponse>('/suppliers/create', input);
    if (!data.success) throw new Error('Failed to create supplier');
    return data.data;
  },

  update: async (input: UpdateSupplierInput): Promise<Supplier> => {
    const { sup_id, ...body } = input;
    const { data } = await api.put<SupplierMutationResponse>(`/suppliers/${sup_id}`, body);
    if (!data.success) throw new Error('Failed to update supplier');
    return data.data;
  },

  delete: async (sup_id: number): Promise<void> => {
    const { data } = await api.delete<DeleteSupplierResponse>(`/suppliers/${sup_id}`);
    if (!data.success) throw new Error('Failed to delete supplier');
  },
};
