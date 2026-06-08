import type {
  Category,
  CreateCategoryInput,
  CategoryMutationResponse,
  DeleteCategoryResponse,
  GetAllCategoriesResponse,
  GetCategoryResponse,
  UpdateCategoryInput,
} from '@/types/category.type';
import { api } from './api';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<GetAllCategoriesResponse>('/categories/all');
    if (!data.success) throw new Error('Failed to load categories');
    return data.data;
  },

  getById: async (cate_id: number): Promise<Category> => {
    const { data } = await api.get<GetCategoryResponse>(`/categories/${cate_id}`);
    if (!data.success) throw new Error('Failed to load category');
    return data.data;
  },

  create: async (input: CreateCategoryInput): Promise<Category> => {
    const { data } = await api.post<CategoryMutationResponse>('/categories/create', input);
    if (!data.success) throw new Error('Failed to create category');
    return data.data;
  },

  update: async (input: UpdateCategoryInput): Promise<Category> => {
    const { data } = await api.put<CategoryMutationResponse>(`/categories/${input.cate_id}`, {
      cate_name: input.cate_name,
    });
    if (!data.success) throw new Error('Failed to update category');
    return data.data;
  },

  delete: async (cate_id: number): Promise<void> => {
    const { data } = await api.delete<DeleteCategoryResponse>(`/categories/${cate_id}`);
    if (!data.success) throw new Error('Failed to delete category');
  },
};
