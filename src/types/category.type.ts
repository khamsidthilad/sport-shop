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
