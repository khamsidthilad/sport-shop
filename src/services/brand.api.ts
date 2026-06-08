import {
  toCreateBrandFormData,
  toUpdateBrandFormData,
  type Brand,
  type BrandMutationResponse,
  type CreateBrandInput,
  type DeleteBrandResponse,
  type GetAllBrandsResponse,
  type GetBrandResponse,
  type UpdateBrandInput,
} from '@/types/brand.type';
import { normalizeProductImage } from '@/utils/getProductImageUrl';
import { api } from './api';

function normalizeBrand(item: Brand): Brand {
  return {
    ...item,
    brand_logo: item.brand_logo ? normalizeProductImage(item.brand_logo) : undefined,
  };
}

export const brandService = {
  getAll: async (): Promise<Brand[]> => {
    const { data } = await api.get<GetAllBrandsResponse>('/brands/all');
    if (!data.success) throw new Error('Failed to load brands');
    return data.data.map(normalizeBrand);
  },

  getById: async (brand_id: number): Promise<Brand> => {
    const { data } = await api.get<GetBrandResponse>(`/brands/${brand_id}`);
    if (!data.success) throw new Error('Failed to load brand');
    return normalizeBrand(data.data);
  },

  create: async (input: CreateBrandInput): Promise<Brand> => {
    const { data } = await api.post<BrandMutationResponse>(
      '/brands/create',
      toCreateBrandFormData(input),
    );
    if (!data.success) throw new Error('Failed to create brand');
    return normalizeBrand(data.data);
  },

  update: async (input: UpdateBrandInput): Promise<Brand> => {
    const { data } = await api.put<BrandMutationResponse>(
      `/brands/${input.brand_id}`,
      toUpdateBrandFormData(input),
    );
    if (!data.success) throw new Error('Failed to update brand');
    return normalizeBrand(data.data);
  },

  delete: async (brand_id: number): Promise<void> => {
    const { data } = await api.delete<DeleteBrandResponse>(`/brands/${brand_id}`);
    if (!data.success) throw new Error('Failed to delete brand');
  },
};
