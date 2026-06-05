export interface CreateProductInput {
  pro_name: string
  pro_detail: string
  pro_price: string
  pro_qty: number
  pro_image: File
  cate_id: number
  brand_id: number
}

export interface CreateProductResponse {
  success: boolean
  data: CreateProductData
}

export interface CreateProductData {
  pro_id: number
  pro_name: string
  pro_detail: string
  pro_price: string
  pro_qty: number
  pro_image: string
  cate_id: number
  brand_id: number
  updatedAt: string
  createdAt: string
}
