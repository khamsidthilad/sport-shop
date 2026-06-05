export interface GetAllProductsResponse {
  success: boolean
  data: Product[]
}

export interface Product {
  pro_id: number
  pro_name?: string
  pro_detail?: string
  pro_price?: string
  pro_image?: string
  pro_qty: number
  cate_id?: number
  brand_id?: number
  createdAt: string
  updatedAt: string
  category?: Category
  brand?: Brand
}

export interface Category {
  cate_id: number
  cate_name: string
  createdAt: string
  updatedAt: string
}

export interface Brand {
  brand_id: number
  name: string
  tagline: string
  country: string
  brand_logo: string
  createdAt: string
  updatedAt: string
}
