import axios from 'axios';
import type {
  ContactInfo,
  ContactInfoResponse,
  SubmitContactInput,
  SubmitContactResponse,
} from '@/types/contact.type';
import { api } from './api';

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export const contactService = {
  getInfo: async (): Promise<ContactInfo> => {
    try {
      const { data } = await api.get<ContactInfoResponse>('/contact/info');
      if (!data.success) throw new Error(data.message ?? 'Failed to load contact info');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to load contact info'));
    }
  },

  submit: async (input: SubmitContactInput): Promise<void> => {
    try {
      const { data } = await api.post<SubmitContactResponse>('/contact', input);
      if (!data.success) throw new Error(data.message ?? 'Failed to send message');
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to send message'));
    }
  },
};
