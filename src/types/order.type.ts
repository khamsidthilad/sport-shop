import type { Customer } from '@/types/customer.type';

export type ShippingStatus =
  | 'waiting'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export const SHIPPING_STATUSES: ShippingStatus[] = [
  'waiting',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export interface BillSellDetailProduct {
  pro_id: number;
  pro_name?: string;
  pro_price?: string;
}

export interface BillSellDetail {
  detail_id: number;
  Order_id: number | null;
  Pro_id: number | null;
  qty: number | null;
  Total: number | null;
  date: string | null;
  image: string | null;
  product?: BillSellDetailProduct;
}

export interface Order {
  order_id: number;
  pro_id: number | null;
  date: string | null;
  price: number | null;
  cus_id: number | null;
  payment_status: string | null;
  shipping_status: string | null;
  payment_image: File | null;
  tracking_number: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  billDetails?: BillSellDetail[];
}

export interface GetOrderReportResponse {
  success: boolean;
  message?: string;
  data: Order[];
}

export interface GetOrderDetailResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export interface GetCustomerOrdersResponse {
  success: boolean;
  message?: string;
  data: Order[];
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message?: string;
  data: Order;
}

export interface CreateOrderItemInput {
  /** Backend accepts `productId` or `pro_id` */
  pro_id?: number;
  productId?: number;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
}

export interface CreateOrderData {
  orderId: number;
  totalPrice: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  data: CreateOrderData;
}

export interface UploadPaymentData {
  orderId: number;
  paymentStatus: string | null;
}

export interface UploadPaymentResponse {
  success: boolean;
  message?: string;
  data: UploadPaymentData;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: { message?: string; details?: unknown };
}

export interface CustomerOrderStats {
  count: number;
  total: number;
}

export function getOrderCustomerName(order: Order): string {
  return order.customer?.cus_name ?? '—';
}

export function getOrderDate(order: Order): string {
  return order.date ?? order.createdAt;
}

export function formatStatusLabel(status: string | null | undefined): string {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function buildOrderStatsByCustomer(orders: Order[]): Map<number, CustomerOrderStats> {
  const map = new Map<number, CustomerOrderStats>();

  for (const order of orders) {
    if (order.cus_id == null) continue;

    const prev = map.get(order.cus_id) ?? { count: 0, total: 0 };
    map.set(order.cus_id, {
      count: prev.count + 1,
      total: prev.total + (order.price ?? 0),
    });
  }

  return map;
}




