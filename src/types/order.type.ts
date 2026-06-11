import { lo, statusLabel } from '@/lib/lao';
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
  payment_image: string | File | null;
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
  return order.customer?.cus_name ?? lo.common.na;
}

export function getOrderDate(order: Order): string {
  return order.date ?? order.createdAt;
}

export function formatStatusLabel(status: string | null | undefined | File): string {
  if (!status || status instanceof File) return lo.common.na;
  return statusLabel(status);
}

const PAYMENT_PAID_STATUSES = new Set([
  'paid',
  'verified',
  'approved',
  'completed',
  'success',
]);

const PAYMENT_SUBMITTED_STATUSES = new Set([
  'submitted',
  'reviewing',
  'processing',
  'pending_review',
  'uploaded',
]);

function hasPaymentReceipt(order: Pick<Order, 'payment_image'>): boolean {
  const image = order.payment_image;
  if (image == null) return false;
  if (typeof image === 'string') return image.length > 0;
  return true;
}

export function isOrderCancelled(order: Order): boolean {
  return (order.shipping_status ?? '').toLowerCase().trim() === 'cancelled';
}

export function canCancelOrder(order: Order): boolean {
  if (isOrderCancelled(order)) return false;
  if (isPaymentComplete(order)) return false;
  const shipping = (order.shipping_status ?? 'waiting').toLowerCase().trim();
  return shipping === 'waiting' || shipping === 'processing';
}

export function isPaymentComplete(order: Order): boolean {
  if (isOrderCancelled(order)) return false;
  const status = order.payment_status?.toLowerCase().trim();
  if (status === 'rejected' || status === 'failed') return false;
  if (PAYMENT_PAID_STATUSES.has(status ?? '')) return true;
  if (PAYMENT_SUBMITTED_STATUSES.has(status ?? '')) return true;
  return hasPaymentReceipt(order);
}

export function isOrderAwaitingPayment(order: Order): boolean {
  if (isOrderCancelled(order)) return false;
  return !isPaymentComplete(order);
}

export function canUploadPaymentReceipt(order: Order): boolean {
  if (isOrderCancelled(order)) return false;
  return !isPaymentComplete(order);
}

export function getPaymentDisplayLabel(
  status: string | null | undefined,
  order?: Pick<Order, 'payment_image' | 'shipping_status'>,
): string {
  if (order && isOrderCancelled(order as Order)) return lo.order.cancelled;

  const orderLike = {
    payment_status: status ?? null,
    payment_image: order?.payment_image ?? null,
    shipping_status: order?.shipping_status ?? null,
  } as Order;

  if (isPaymentComplete(orderLike)) return lo.order.paymentComplete;

  const normalized = status?.toLowerCase().trim();
  if (!normalized || normalized === 'pending' || normalized === 'unpaid' || normalized === 'waiting') {
    return lo.order.awaitingPayment;
  }
  if (normalized === 'rejected' || normalized === 'failed') return lo.order.paymentFailed;
  return formatStatusLabel(status);
}

export function getPaymentStatusTone(
  status: string | null | undefined,
  order?: Pick<Order, 'payment_image' | 'shipping_status'>,
): 'pending' | 'submitted' | 'paid' | 'neutral' | 'cancelled' {
  if (order && isOrderCancelled(order as Order)) return 'cancelled';

  const orderLike = {
    payment_status: status ?? null,
    payment_image: order?.payment_image ?? null,
    shipping_status: order?.shipping_status ?? null,
  } as Order;

  if (isPaymentComplete(orderLike)) return 'paid';

  const normalized = status?.toLowerCase().trim();
  if (!normalized || normalized === 'pending' || normalized === 'unpaid' || normalized === 'waiting') {
    return 'pending';
  }
  if (PAYMENT_PAID_STATUSES.has(normalized)) return 'paid';
  if (PAYMENT_SUBMITTED_STATUSES.has(normalized)) return 'submitted';
  if (normalized === 'rejected' || normalized === 'failed') return 'pending';
  return 'neutral';
}

export function getShippingDisplayLabel(status: string | null | undefined): string {
  if (status?.toLowerCase().trim() === 'cancelled') return lo.order.cancelled;
  return formatStatusLabel(status);
}

export function getShippingStatusTone(
  status: string | null | undefined,
): 'pending' | 'submitted' | 'paid' | 'neutral' | 'cancelled' {
  const normalized = status?.toLowerCase().trim();
  if (normalized === 'cancelled') return 'cancelled';
  if (normalized === 'delivered') return 'paid';
  if (normalized === 'shipped' || normalized === 'processing') return 'submitted';
  return 'neutral';
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




