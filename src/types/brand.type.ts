import type { Category } from '@/types/category.type';

export interface Brand {
  brand_id: number;
  name: string;
  tagline: string;
  country: string;
  brand_logo?: string | null;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
}

export interface GetAllBrandsResponse {
  success: boolean;
  data: Brand[];
}

export interface GetBrandResponse {
  success: boolean;
  data: Brand;
}

export interface CreateBrandInput {
  name: string;
  tagline: string;
  country: string;
  brand_logo?: File;
}

export interface UpdateBrandInput {
  brand_id: number;
  name: string;
  tagline: string;
  country: string;
  brand_logo?: File;
}

export type BrandMutationResponse = GetBrandResponse;

export interface DeleteBrandResponse {
  success: boolean;
  message?: string;
}

export function toCreateBrandFormData(input: CreateBrandInput): FormData {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('tagline', input.tagline);
  formData.append('country', input.country);
  if (input.brand_logo) {
    formData.append('brand_logo', input.brand_logo);
  }
  return formData;
}

export function toUpdateBrandFormData(input: UpdateBrandInput): FormData {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('tagline', input.tagline);
  formData.append('country', input.country);
  if (input.brand_logo) {
    formData.append('brand_logo', input.brand_logo);
  }
  return formData;
}
