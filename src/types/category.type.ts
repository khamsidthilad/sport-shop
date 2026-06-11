import { lo } from '@/lib/lao';

export interface Category {
  cate_id: number;
  cate_name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllCategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface GetCategoryResponse {
  success: boolean;
  data: Category;
}

export interface CreateCategoryInput {
  cate_name: string;
}

export interface UpdateCategoryInput {
  cate_id: number;
  cate_name: string;
}

export type CategoryMutationResponse = GetCategoryResponse;

export interface DeleteCategoryResponse {
  success: boolean;
  message?: string;
}

export function getCategoryLabel(category: Category): string {
  return category.cate_name?.trim() || lo.common.categoryFallback;
}

export function getCategoryHref(category: Category): string | null {
  const id = category.cate_id;
  if (typeof id !== 'number' || !Number.isFinite(id) || id < 1) return null;
  return `/category/${id}`;
}
