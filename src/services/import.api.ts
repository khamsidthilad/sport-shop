import axios from 'axios';
import type {
  CreateImportInput,
  DeleteImportResponse,
  GetImportsResponse,
  ImportMutationResponse,
  ImportRecord,
} from '@/types/import.type';
import { api } from './api';

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

function normalizeImport(record: ImportRecord): ImportRecord {
  return {
    ...record,
    quantity: record.quantity == null ? null : Number(record.quantity),
    price: record.price == null ? null : Number(record.price),
  };
}

export const importService = {
  getAll: async (): Promise<ImportRecord[]> => {
    try {
      const { data } = await api.get<GetImportsResponse>('/imports/all');
      if (!data.success) throw new Error(data.message ?? 'Failed to load imports');
      return data.data.map(normalizeImport);
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to load imports'));
    }
  },

  create: async (input: CreateImportInput): Promise<ImportRecord> => {
    try {
      const { data } = await api.post<ImportMutationResponse>('/imports/create', input);
      if (!data.success) throw new Error(data.message ?? 'Failed to create import');
      return normalizeImport(data.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to create import'));
    }
  },

  delete: async (purchaseId: number): Promise<void> => {
    try {
      const { data } = await api.delete<DeleteImportResponse>(`/imports/${purchaseId}`);
      if (!data.success) throw new Error(data.message ?? 'Failed to delete import');
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to delete import'));
    }
  },
};
