import type {
  CreateUserInput,
  DeleteUserResponse,
  GetUserResponse,
  GetUsersResponse,
  UpdateUserInput,
  User,
  UserMutationResponse,
} from '@/types/user.type';
import { api } from './api';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<GetUsersResponse>('/users/all');
    if (!data.success) throw new Error('Failed to load users');
    return data.data;
  },

  getById: async (User_id: string): Promise<User> => {
    const { data } = await api.get<GetUserResponse>(`/users/${User_id}`);
    if (!data.success) throw new Error('Failed to load user');
    return data.data;
  },

  create: async (input: CreateUserInput): Promise<User> => {
    const { data } = await api.post<UserMutationResponse>('/users/create', input);
    if (!data.success) throw new Error('Failed to create user');
    return data.data;
  },

  update: async (input: UpdateUserInput): Promise<User> => {
    const { User_id, ...body } = input;
    const { data } = await api.put<UserMutationResponse>(`/users/${User_id}`, body);
    if (!data.success) throw new Error('Failed to update user');
    return data.data;
  },

  delete: async (User_id: string): Promise<void> => {
    const { data } = await api.delete<DeleteUserResponse>(`/users/${User_id}`);
    if (!data.success) throw new Error('Failed to delete user');
  },
};
