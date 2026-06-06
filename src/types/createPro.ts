export interface CreateProductResponse {
  success: boolean;
  data: CreateProductData;
}

/** Raw product record returned by POST /products/create */
export interface CreateProductData {
  pro_id: number;
  pro_name: string;
  pro_detail: string;
  pro_price: string;
  pro_qty: string;
  pro_image: unknown;
  cate_id: string;
  brand_id: string;
  updatedAt: string;
  createdAt: string;
}

/** Payload for creating a product */
export interface CreateProductInput {
  pro_name: string;
  pro_detail: string;
  pro_price: string;
  pro_qty: number;
  cate_id: number;
  brand_id: number;
  pro_image: File;
}

export function toCreateFormData(input: CreateProductInput): FormData {
  const formData = new FormData();
  formData.append('pro_name', input.pro_name);
  formData.append('pro_detail', input.pro_detail);
  formData.append('pro_price', input.pro_price);
  formData.append('pro_qty', String(input.pro_qty));
  formData.append('cate_id', String(input.cate_id));
  formData.append('brand_id', String(input.brand_id));
  formData.append('pro_image', input.pro_image);
  return formData;
}

/** Payload for updating a product (image optional — omit to keep existing) */
export interface UpdateProductInput {
  pro_id: number;
  pro_name: string;
  pro_detail: string;
  pro_price: string;
  pro_qty: number;
  cate_id: number;
  brand_id: number;
  pro_image?: File;
}

export type UpdateProductResponse = CreateProductResponse;

export function toUpdateFormData(input: UpdateProductInput): FormData {
  const formData = new FormData();
  formData.append('pro_name', input.pro_name);
  formData.append('pro_detail', input.pro_detail);
  formData.append('pro_price', input.pro_price);
  formData.append('pro_qty', String(input.pro_qty));
  formData.append('cate_id', String(input.cate_id));
  formData.append('brand_id', String(input.brand_id));
  if (input.pro_image) {
    formData.append('pro_image', input.pro_image);
  }
  return formData;
}
