'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, MapPin, Package, KeyRound, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useCustomerSession } from '@/hooks/useCustomerSession';
import { logoutCustomer } from '@/redux/slices/authSlice';
import { authService } from '@/services/auth.api';
import { orderService } from '@/services/order.api';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { getDisplayName } from '@/types/auth.type';
import {
  canCancelOrder,
  getOrderDate,
  isOrderAwaitingPayment,
  type Order,
} from '@/types/order.type';
import { lo, statusLabel } from '@/lib/lao';

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
    <dd className="mt-0.5 font-semibold">{value}</dd>
  </div>
);

export default function ProfilePage() {
  const session = useCustomerSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    let cancelled = false;

    const loadOrders = (showLoading = true) => {
      if (showLoading) setOrdersLoading(true);

      orderService
        .getByCustomerId(session.customer.cus_id)
        .then((items) => {
          if (!cancelled) setOrders(items);
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            const message = err instanceof Error ? err.message : lo.toast.failedLoadOrders;
            toast.error(message);
          }
        })
        .finally(() => {
          if (!cancelled) setOrdersLoading(false);
        });
    };

    loadOrders();

    const refreshOrders = () => loadOrders(false);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshOrders();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refreshOrders);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refreshOrders);
    };
  }, [session, router]);

  if (!session) return null;

  const { customer, user } = session;

  const handleCancelOrder = async (order: Order) => {
    if (!confirm(lo.checkout.cancelConfirm(order.order_id))) return;

    setCancellingId(order.order_id);
    try {
      const updated = await orderService.cancel(order.order_id);
      setOrders((prev) =>
        prev.map((item) => (item.order_id === updated.order_id ? updated : item)),
      );
      toast.success(lo.checkout.cancelSuccess);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedCancelOrder;
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 4) {
      toast.error(lo.profile.passwordMin);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(lo.profile.passwordMismatch);
      return;
    }

    setUpdatingPassword(true);
    try {
      await authService.updateProfile({ password });
      setPassword('');
      setConfirmPassword('');
      toast.success(lo.profile.passwordUpdated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedUpdatePassword;
      toast.error(message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 font-display text-4xl md:text-5xl">{lo.profile.title}</h1>
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <aside className="h-fit border border-border p-4">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {user.name.charAt(0) || customer.cus_name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{getDisplayName(session)}</div>
                <div className="text-xs text-muted-foreground">@{user.username}</div>
              </div>
            </div>
            <nav className="mt-4 space-y-1 text-sm">
              <a href="#info" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
                <User className="h-4 w-4" /> {lo.profile.information}
              </a>
              <a href="#address" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
                <MapPin className="h-4 w-4" /> {lo.profile.address}
              </a>
              <a href="#orders" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
                <Package className="h-4 w-4" /> {lo.profile.orders}
              </a>
              <a href="#password" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
                <KeyRound className="h-4 w-4" /> {lo.profile.password}
              </a>
              <button
                type="button"
                onClick={() => {
                  dispatch(logoutCustomer());
                  router.push('/');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4" /> {lo.profile.logout}
              </button>
            </nav>
          </aside>

          <div className="space-y-8">
            <section id="info" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">{lo.profile.profileInfo}</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Detail label={lo.profile.fullName} value={customer.cus_name} />
                <Detail label={lo.common.username} value={user.username} />
                <Detail label={lo.common.email} value={customer.Email || lo.common.na} />
                <Detail label={lo.common.tel} value={customer.Tel || lo.common.na} />
              </dl>
            </section>

            <section id="address" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">{lo.profile.address}</h2>
              <p className="text-sm">{customer.address || lo.common.na}</p>
              <p className="mt-2 text-xs text-muted-foreground">{lo.profile.status} {statusLabel(customer.cus_status)}</p>
            </section>

            <section id="orders" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">
                {lo.profile.orderHistory} ({ordersLoading ? '…' : orders.length})
              </h2>
              {ordersLoading ? (
                <p className="text-sm text-muted-foreground">{lo.profile.loadingOrders}</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {lo.profile.noOrders}{' '}
                  <Link href="/shop" className="text-accent-brand">
                    {lo.profile.startShopping}
                  </Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.order_id}
                      className="flex flex-col gap-3 border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-semibold">#{o.order_id}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(getOrderDate(o)).toLocaleDateString()} ·{' '}
                          {o.billDetails?.length ?? 0} {lo.profile.items}
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="font-bold">{formatCurrency(o.price ?? 0)}</div>
                        <div className="flex flex-wrap gap-1">
                          <OrderStatusBadge
                            label={lo.order.payment}
                            status={o.payment_status}
                            kind="payment"
                            order={o}
                          />
                          <OrderStatusBadge
                            label={lo.order.shipping}
                            status={o.shipping_status}
                            kind="shipping"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {isOrderAwaitingPayment(o) && (
                            <Link
                              href={`/checkout?orderId=${o.order_id}`}
                              className="bg-accent-brand px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90"
                            >
                              {lo.profile.payNow}
                            </Link>
                          )}
                          {canCancelOrder(o) && (
                            <button
                              type="button"
                              onClick={() => void handleCancelOrder(o)}
                              disabled={cancellingId === o.order_id}
                              className="border border-destructive px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                            >
                              {cancellingId === o.order_id ? lo.checkout.cancelling : lo.checkout.cancelOrder}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="password" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">{lo.profile.changePassword}</h2>
              <form onSubmit={handlePasswordSubmit} className="max-w-sm space-y-3">
                <input
                  type="password"
                  placeholder={lo.profile.newPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2"
                  required
                  minLength={4}
                />
                <input
                  type="password"
                  placeholder={lo.profile.confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2"
                  required
                  minLength={4}
                />
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-primary px-6 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-50"
                >
                  {updatingPassword ? lo.profile.updating : lo.profile.update}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
