'use client';

import { useEffect, useState } from 'react';
import { Printer, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { orderService } from '@/services/order.api';
import { PaymentQrImage } from '@/components/order/PaymentQrImage';
import {
  formatStatusLabel,
  getOrderCustomerName,
  getOrderDate,
  getPaymentDisplayLabel,
  SHIPPING_STATUSES,
  type Order,
  type ShippingStatus,
} from '@/types/order.type';
import { formatCurrency } from '@/utils/formatCurrency';
import { getPaymentImageUrl } from '@/utils/getProductImageUrl';

function hasPaymentReceipt(order: Order): boolean {
  return Boolean(getPaymentImageUrl(order.payment_image));
}

export default function OrderAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [view, setView] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    orderService
      .getReport()
      .then((items) => {
        if (!cancelled) setOrders(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load orders';
          setError(message);
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = filter
    ? orders.filter((o) => o.shipping_status === filter)
    : orders;
  const detail = orders.find((o) => o.order_id === view);

  const handleStatusChange = async (orderId: number, status: ShippingStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, ...updated } : o)),
      );
      toast.success('Status updated');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">ORDERS</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading…' : `${filtered.length} of ${orders.length}`}
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-border bg-background"
        >
          <option value="">All statuses</option>
          {SHIPPING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3">
          {error}
        </p>
      )}

      <div className="bg-card border border-border overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase">
              <tr>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-right p-3">Total</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-left p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const isUpdating = updatingId === o.order_id;
                const currentStatus = (o.shipping_status ?? 'waiting') as ShippingStatus;

                return (
                  <tr key={o.order_id} className="border-t border-border">
                    <td className="p-3 font-mono text-xs font-bold">#{o.order_id}</td>
                    <td className="p-3">{getOrderCustomerName(o)}</td>
                    <td className="p-3 text-xs">
                      {new Date(getOrderDate(o)).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right font-bold">
                      {formatCurrency(o.price ?? 0)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-secondary">
                          {getPaymentDisplayLabel(o.payment_status, o)}
                        </span>
                        {hasPaymentReceipt(o) && (
                          <button
                            type="button"
                            onClick={() => setView(o.order_id)}
                            className="overflow-hidden border border-border hover:opacity-80"
                            title="View payment receipt"
                          >
                            <PaymentQrImage
                              src={o.payment_image?.toString() ?? null}
                              alt={`Payment receipt #${o.order_id}`}
                              size={40}
                              showQrFallback={false}
                              emptyLabel=""
                              className="object-cover"
                            />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={currentStatus}
                        disabled={isUpdating}
                        onChange={(e) =>
                          void handleStatusChange(o.order_id, e.target.value as ShippingStatus)
                        }
                        className="px-2 py-1 border border-border bg-background text-xs disabled:opacity-50"
                      >
                        {SHIPPING_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {formatStatusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-center">
                        <button
                          type="button"
                          onClick={() => setView(o.order_id)}
                          className="p-1.5 hover:bg-secondary"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="p-1.5 hover:bg-secondary"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card max-w-2xl w-full p-6 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-display text-2xl">INVOICE — #{detail.order_id}</h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(getOrderDate(detail)).toLocaleString()}
                </p>
              </div>
              <button type="button" onClick={() => setView(null)} className="text-2xl">
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground uppercase">Customer</div>
                {getOrderCustomerName(detail)}
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase">Payment</div>
                {getPaymentDisplayLabel(detail.payment_status, detail)}
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase">Shipping</div>
                {formatStatusLabel(detail.shipping_status)}
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase">Tracking</div>
                {detail.tracking_number || '—'}
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground uppercase">Address</div>
                {detail.customer?.address || '—'}
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="text-xs text-muted-foreground uppercase mb-3">
                Payment receipt
              </div>
              {hasPaymentReceipt(detail) ? (
                <PaymentQrImage
                  src={detail.payment_image?.toString() ?? null}
                  alt={`Payment receipt for order #${detail.order_id}`}
                  size={280}
                  showQrFallback={false}
                  emptyLabel="No payment receipt uploaded"
                  className="mx-auto border border-border object-contain bg-secondary"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No payment receipt uploaded yet.</p>
              )}
            </div>

            <table className="w-full text-sm mt-4 border-t border-border">
              <thead>
                <tr className="text-left text-xs uppercase">
                  <th className="py-2">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(detail.billDetails ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-muted-foreground">
                      No line items.
                    </td>
                  </tr>
                ) : (
                  detail.billDetails!.map((it) => (
                    <tr key={it.detail_id} className="border-t border-border">
                      <td className="py-2">{it.product?.pro_name ?? `Product #${it.Pro_id}`}</td>
                      <td className="text-center">{it.qty ?? 0}</td>
                      <td className="text-right">{formatCurrency(it.Total ?? 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm text-right">
              <div className="font-display text-xl">
                TOTAL:{' '}
                <span className="text-accent-brand">{formatCurrency(detail.price ?? 0)}</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-primary text-primary-foreground px-4 py-2 font-bold uppercase text-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
