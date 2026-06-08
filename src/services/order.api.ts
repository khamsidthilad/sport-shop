import axios from 'axios';
import type {
  ApiErrorResponse,
  CreateOrderData,
  CreateOrderInput,
  CreateOrderResponse,
  GetCustomerOrdersResponse,
  GetOrderDetailResponse,
  GetOrderReportResponse,
  Order,
  ShippingStatus,
  UpdateOrderStatusResponse,
  UploadPaymentData,
  UploadPaymentResponse,
} from '@/types/order.type';
import { api } from './api';

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    const body = err.response?.data;
    return body?.message ?? body?.error?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

function assertSuccess<T extends { success: boolean; message?: string }>(
  data: T,
  fallback: string,
): asserts data is T & { success: true } {
  if (!data.success) throw new Error(data.message ?? fallback);
}

/** Maps to backend `/orders/*` routes (Order-Product collection) */
export const orderService = {
  /** GET /orders/report — admin order report */
  getReport: async (): Promise<Order[]> => {
    try {
      const { data } = await api.get<GetOrderReportResponse>('/orders/report');
      assertSuccess(data, 'Failed to load order report');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to load order report'));
    }
  },

  /** GET /orders/:orderId — order detail with customer + billDetails */
  getById: async (orderId: number): Promise<Order> => {
    try {
      const { data } = await api.get<GetOrderDetailResponse>(`/orders/${orderId}`);
      assertSuccess(data, 'Failed to load order detail');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to load order detail'));
    }
  },

  /** GET /orders/customers/:id/orders — orders for one customer */
  getByCustomerId: async (customerId: number): Promise<Order[]> => {
    try {
      const { data } = await api.get<GetCustomerOrdersResponse>(
        `/orders/customers/${customerId}/orders`,
      );
      assertSuccess(data, 'Failed to load customer orders');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to load customer orders'));
    }
  },

  /** POST /orders/create — customer checkout */
  create: async (input: CreateOrderInput): Promise<CreateOrderData> => {
    try {
      const { data } = await api.post<CreateOrderResponse>('/orders/create', input);
      assertSuccess(data, 'Failed to create order');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to create order'));
    }
  },

  /** PUT /orders/:orderId/status — admin update shipping status */
  updateStatus: async (orderId: number, status: ShippingStatus): Promise<Order> => {
    try {
      const { data } = await api.put<UpdateOrderStatusResponse>(
        `/orders/${orderId}/status`,
        { status },
      );
      assertSuccess(data, 'Failed to update order status');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to update order status'));
    }
  },

  /** PUT /orders/:orderId/cancel — customer cancel order */
  cancel: async (orderId: number): Promise<Order> => {
    try {
      const { data } = await api.put<UpdateOrderStatusResponse>(
        `/orders/${orderId}/cancel`,
      );
      assertSuccess(data, 'Failed to cancel order');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to cancel order'));
    }
  },

  /** POST /orders/:orderId/payment — upload payment receipt (multipart) */
  uploadPayment: async (orderId: number, receipt: File): Promise<UploadPaymentData> => {
    const formData = new FormData();
    formData.append('receipt', receipt);

    try {
      const { data } = await api.post<UploadPaymentResponse>(
        `/orders/${orderId}/payment`,
        formData,
      );
      assertSuccess(data, 'Failed to upload payment receipt');
      return data.data;
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Failed to upload payment receipt'));
    }
  },
};
