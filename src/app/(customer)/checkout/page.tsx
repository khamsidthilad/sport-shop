'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useCartItems, useMounted } from '@/hooks/useCartCount';
import { useCustomerSession } from '@/hooks/useCustomerSession';
import { clearCart } from '@/redux/slices/cartSlice';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { PaymentQrImage } from '@/components/order/PaymentQrImage';
import { formatCurrency } from '@/utils/formatCurrency';
import { orderService } from '@/services/order.api';
import { productService } from '@/services/product.api';
import { getDisplayName } from '@/types/auth.type';
import {
  canCancelOrder,
  canUploadPaymentReceipt,
  getPaymentDisplayLabel,
  isOrderAwaitingPayment,
  isOrderCancelled,
  isPaymentComplete,
  type Order,
} from '@/types/order.type';
import type { Product } from '@/types/product.type';
import { lo, statusLabel } from '@/lib/lao';

const schema = z.object({
  fullName: z.string().trim().min(2, lo.common.required).max(100),
  email: z.string().trim().email().max(255),
  tel: z.string().trim().min(8, lo.common.required).max(20),
  address: z.string().trim().min(5, lo.common.required).max(255),
  city: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(4).max(10),
  payment: z.literal('QR'),
});

type FormData = z.infer<typeof schema>;

function parsePrice(price?: string) {
  return Number(price ?? 0);
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const payOrderId = searchParams.get('orderId');
  const session = useCustomerSession();
  const cart = useCartItems();
  const mounted = useMounted();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadedPayOrderId, setLoadedPayOrderId] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadingProducts = cart.length > 0 && products.length === 0 && !fetchFailed;

  useEffect(() => {
    if (!session) {
      const redirect = payOrderId
        ? `/checkout?orderId=${payOrderId}`
        : '/checkout';
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [session, router, payOrderId]);

  useEffect(() => {
    if (!session || !payOrderId) return;

    const orderId = Number(payOrderId);
    if (!Number.isFinite(orderId)) {
      toast.error(lo.toast.invalidOrder);
      return;
    }

    let cancelled = false;

    orderService
      .getById(orderId)
      .then((order) => {
        if (cancelled) return;
        if (order.cus_id !== session.customer.cus_id) {
          toast.error(lo.toast.orderNotFound);
          router.replace('/profile');
          return;
        }
        setPlacedOrder(order);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : lo.toast.failedLoadOrders;
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadedPayOrderId(payOrderId);
      });

    return () => {
      cancelled = true;
    };
  }, [payOrderId, session, router]);

  useEffect(() => {
    let cancelled = false;

    productService
      .getAll()
      .then((items) => {
        if (!cancelled) {
          setFetchFailed(false);
          setProducts(items);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setFetchFailed(true);
          const message = err instanceof Error ? err.message : lo.toast.failedLoadProducts;
          toast.error(message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const product of products) {
      map.set(String(product.pro_id), product);
    }
    return map;
  }, [products]);

  const enriched = useMemo(
    () =>
      cart
        .map((item) => {
          const product = productMap.get(item.productId);
          return product ? { ...item, product } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item != null),
    [cart, productMap],
  );

  const subtotal = enriched.reduce(
    (sum, item) => sum + parsePrice(item.product.pro_price) * item.quantity,
    0,
  );
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment: 'QR',
      fullName: session ? getDisplayName(session) : '',
      email: session?.customer.Email ?? '',
      tel: session?.customer.Tel ?? '',
      address: session?.customer.address ?? '',
      city: '',
      postalCode: '',
    },
  });

  const onSubmit = async () => {
    if (!session?.token) {
      toast.error(lo.checkout.loginRequired);
      router.push('/login');
      return;
    }

    if (enriched.length === 0) {
      toast.error(lo.checkout.noValidCart);
      return;
    }

    setSubmitting(true);
    try {
      const created = await orderService.create({
        items: enriched.map((item) => ({
          pro_id: Number(item.productId),
          quantity: item.quantity,
        })),
      });

      const customerOrders = await orderService.getByCustomerId(session.customer.cus_id);
      const order =
        customerOrders.find((o) => o.order_id === created.orderId) ??
        (await orderService.getById(created.orderId));
      dispatch(clearCart());
      setPlacedOrder(order);
      toast.success(lo.checkout.orderPlaced(order.order_id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedPlaceOrder;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadReceipt = async () => {
    if (!placedOrder || !receiptFile) {
      toast.error(lo.checkout.selectReceipt);
      return;
    }

    setUploading(true);
    try {
      const result = await orderService.uploadPayment(placedOrder.order_id, receiptFile);
      const refreshed = await orderService.getById(placedOrder.order_id);
      setPlacedOrder({
        ...refreshed,
        payment_status: result.paymentStatus ?? refreshed.payment_status ?? 'submitted',
      });
      setReceiptFile(null);
      toast.success(lo.checkout.paymentUploaded);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedUploadReceipt;
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!placedOrder) return;
    if (!confirm(lo.checkout.cancelConfirm(placedOrder.order_id))) return;

    setCancelling(true);
    try {
      const updated = await orderService.cancel(placedOrder.order_id);
      setPlacedOrder(updated);
      toast.success(lo.checkout.cancelSuccess);
      router.push('/profile');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedCancelOrder;
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  if (!session) return null;

  const paymentOrder =
    placedOrder && (!payOrderId || placedOrder.order_id === Number(payOrderId))
      ? placedOrder
      : null;
  const loadingPayOrder = !!payOrderId && loadedPayOrderId !== payOrderId && !paymentOrder;

  if (!mounted || loadingProducts || loadingPayOrder) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center text-muted-foreground">{lo.checkout.loading}</div>
      </CustomerLayout>
    );
  }

  if (cart.length === 0 && !paymentOrder && !payOrderId) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center">
          <h1 className="font-display text-3xl">{lo.checkout.emptyCart}</h1>
          <Link href="/shop" className="mt-4 inline-block text-accent-brand underline">
            {lo.checkout.continueShopping}
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  if (fetchFailed) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center text-destructive">{lo.toast.failedLoadCheckout}</div>
      </CustomerLayout>
    );
  }

  if (paymentOrder) {
    const orderTotal = paymentOrder.price ?? total;
    const orderCancelled = isOrderCancelled(paymentOrder);
    const awaitingPayment = isOrderAwaitingPayment(paymentOrder);
    const paymentComplete = isPaymentComplete(paymentOrder);
    const canUpload = canUploadPaymentReceipt(paymentOrder);
    const showCancel = canCancelOrder(paymentOrder);

    return (
      <CustomerLayout>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-2 font-display text-4xl md:text-5xl">
            {orderCancelled
              ? lo.checkout.orderCancelled
              : paymentComplete
                ? lo.checkout.paymentSuccess
                : awaitingPayment
                  ? lo.checkout.qrPayment
                  : lo.checkout.orderStatus}
          </h1>
          <p className="mb-8 text-muted-foreground">
            {lo.checkout.orderNo}{paymentOrder.order_id} · {formatCurrency(orderTotal)}
          </p>

          <section className="space-y-6 border border-border p-6">
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge
                label={lo.order.payment}
                status={paymentOrder.payment_status}
                kind="payment"
                order={paymentOrder}
              />
              <OrderStatusBadge
                label={lo.order.shipping}
                status={paymentOrder.shipping_status}
                kind="shipping"
              />
            </div>

            {orderCancelled ? (
              <div className="space-y-4 rounded border border-red-200 bg-red-50 p-6 text-center">
                <p className="font-display text-2xl text-red-900">{lo.checkout.cancelledTitle}</p>
                <p className="text-sm text-red-800">{lo.checkout.cancelledBody}</p>
                <Link
                  href="/profile"
                  className="inline-block bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand"
                >
                  {lo.checkout.backToOrders}
                </Link>
              </div>
            ) : awaitingPayment ? (
              <>
                <div className="text-center">
                  <h2 className="font-display text-xl">{lo.checkout.scanToPay}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lo.checkout.qrHint}
                  </p>
                </div>

                <PaymentQrImage
                  src={paymentOrder.payment_image?.toString() ?? null}
                  alt={lo.checkout.qrAlt}
                />

                <div className="rounded border border-border bg-secondary/50 p-4 text-center text-sm">
                  <p className="font-semibold">{lo.checkout.amountToPay}</p>
                  <p className="mt-1 font-display text-3xl text-accent-brand">
                    {formatCurrency(orderTotal)}
                  </p>
                </div>

                {canUpload && (
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest">{lo.checkout.uploadReceipt}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                      className="mt-1 w-full border border-border bg-background px-3 py-2 file:mr-3 file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-bold file:uppercase"
                    />
                  </label>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  {canUpload && (
                    <button
                      type="button"
                      onClick={() => void handleUploadReceipt()}
                      disabled={uploading || !receiptFile}
                      className="flex-1 bg-primary py-3 font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-50"
                    >
                      {uploading ? lo.checkout.uploading : lo.checkout.confirmPayment}
                    </button>
                  )}
                  {showCancel && (
                    <button
                      type="button"
                      onClick={() => void handleCancelOrder()}
                      disabled={cancelling || uploading}
                      className="flex-1 border border-destructive py-3 font-bold uppercase tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                    >
                      {cancelling ? lo.checkout.cancelling : lo.checkout.cancelOrder}
                    </button>
                  )}
                  <Link
                    href="/profile"
                    className="flex-1 border border-border py-3 text-center font-bold uppercase tracking-wider hover:bg-secondary"
                  >
                    {lo.checkout.viewOrders}
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-4 rounded border border-emerald-200 bg-emerald-50 p-6 text-center">
                <p className="font-display text-2xl text-emerald-900">{lo.checkout.paymentSuccess}</p>
                <p className="text-sm text-emerald-800">
                  {lo.checkout.paymentSuccessBody}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <OrderStatusBadge
                    label={lo.order.payment}
                    status={paymentOrder.payment_status}
                    kind="payment"
                    order={paymentOrder}
                  />
                  <OrderStatusBadge
                    label={lo.order.shipping}
                    status={paymentOrder.shipping_status}
                    kind="shipping"
                  />
                </div>
                <p className="text-sm">
                  {lo.order.payment}:{' '}
                  <span className="font-semibold">
                    {getPaymentDisplayLabel(paymentOrder.payment_status, paymentOrder)}
                  </span>
                  {' · '}
                  {lo.order.shipping}:{' '}
                  <span className="font-semibold">
                    {statusLabel(paymentOrder.shipping_status)}
                  </span>
                </p>
                <Link
                  href="/profile"
                  className="inline-block bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand"
                >
                  {lo.checkout.backToOrders}
                </Link>
              </div>
            )}
          </section>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-4xl md:text-5xl">{lo.checkout.title}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">{lo.checkout.customerInfo}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={lo.checkout.fullName} error={errors.fullName?.message} {...register('fullName')} />
                <Field label={lo.common.email} type="email" error={errors.email?.message} {...register('email')} />
                <Field label={lo.common.tel} error={errors.tel?.message} {...register('tel')} />
              </div>
            </section>
            <section className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">{lo.checkout.shippingAddress}</h2>
              <div className="grid gap-4">
                <Field label={lo.common.address} error={errors.address?.message} {...register('address')} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={lo.checkout.city} error={errors.city?.message} {...register('city')} />
                  <Field
                    label={lo.checkout.postalCode}
                    error={errors.postalCode?.message}
                    {...register('postalCode')}
                  />
                </div>
              </div>
            </section>
            <section className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">{lo.checkout.paymentMethod}</h2>
              <div className="space-y-4">
                <label className="flex cursor-pointer items-start gap-3 border border-border p-3 hover:border-primary">
                  <input
                    type="radio"
                    value="QR"
                    {...register('payment')}
                    className="mt-1 accent-[oklch(0.62_0.24_25)]"
                  />
                  <div>
                    <div className="font-semibold">{lo.checkout.qrMethod}</div>
                    <div className="text-xs text-muted-foreground">
                      {lo.checkout.qrMethodHint}
                    </div>
                  </div>
                </label>
                <p className="text-xs text-muted-foreground">
                  {lo.checkout.qrHelp}
                </p>
              </div>
            </section>
          </div>
          <aside className="sticky top-24 h-fit border border-border p-6">
            <h2 className="mb-4 font-display text-xl">{lo.checkout.orderSummary}</h2>
            <div className="max-h-60 space-y-2 overflow-auto text-sm">
              {enriched.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between">
                  <span className="truncate pr-2">
                    {item.product.pro_name ?? lo.common.product} × {item.quantity}
                  </span>
                  <span className="shrink-0">
                    {formatCurrency(parsePrice(item.product.pro_price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span>{lo.cart.subtotal}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{lo.cart.shipping}</span>
                <span>{shipping === 0 ? lo.common.free : formatCurrency(shipping)}</span>
              </div>
            </div>
            <div className="my-4 flex justify-between border-t border-border pt-4 font-display text-xl">
              <span>{lo.common.total}</span>
              <span className="text-accent-brand">{formatCurrency(total)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting || enriched.length === 0}
              className="w-full bg-primary py-3 font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-50"
            >
              {submitting ? lo.checkout.placingOrder : lo.checkout.placeOrder}
            </button>
          </aside>
        </form>
      </div>
    </CustomerLayout>
  );
}

const Field = ({
  label,
  error,
  ...rest
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    <input {...rest} className="mt-1 w-full border border-border bg-background px-3 py-2" />
    {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
  </label>
);
