import type { Customer, GetAllCustomersResponse } from '@/types/customer.type';
import { api } from './api';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const { data } = await api.get<GetAllCustomersResponse>('/customers/all');
    if (!data.success) throw new Error('Failed to load customers');
    return data.data;
  },
};
