/** Nested category on a product record */
export interface ProductCategory {
  cate_id: number;
  cate_name: string;
  createdAt: string;
  updatedAt: string;
}

/** API product record */
export interface Product {
  pro_id: number;
  pro_name: string;
  pro_detail: unknown;
  pro_price: string;
  pro_image: unknown;
  pro_qty: number;
  cate_id: number;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
}

/** GET /products response */
export interface GetAllProductsResponse {
  success: boolean;
  data: Product[];
}
