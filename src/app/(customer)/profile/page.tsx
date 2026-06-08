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
import { formatCurrency } from '@/utils/formatCurrency';
import { getDisplayName } from '@/types/auth.type';
import {
  formatStatusLabel,
  getOrderDate,
  type Order,
} from '@/types/order.type';

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

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    let cancelled = false;

    orderService
      .getByCustomerId(session.customer.cus_id)
      .then((items) => {
        if (!cancelled) setOrders(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load orders';
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session, router]);

  if (!session) return null;

  const { customer, user } = session;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      await authService.updateProfile({ password });
      setPassword('');
      setConfirmPassword('');
      toast.success('Password updated');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      toast.error(message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 font-display text-4xl md:text-5xl">MY PROFILE</h1>
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
                <User className="h-4 w-4" /> Information
              </a>
              <a href="#address" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
                <MapPin className="h-4 w-4" /> Address
              </a>
              <a href="#orders" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
                <Package className="h-4 w-4" /> Orders
              </a>
              <a href="#password" className="flex items-center gap-2 px-3 py-2 hover:bg-secondary">
                <KeyRound className="h-4 w-4" /> Password
              </a>
              <button
                type="button"
                onClick={() => {
                  dispatch(logoutCustomer());
                  router.push('/');
                }}
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </aside>

          <div className="space-y-8">
            <section id="info" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">PROFILE INFORMATION</h2>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Full Name" value={customer.cus_name} />
                <Detail label="Username" value={user.username} />
                <Detail label="Email" value={customer.Email || '—'} />
                <Detail label="Telephone" value={customer.Tel || '—'} />
              </dl>
            </section>

            <section id="address" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">ADDRESS</h2>
              <p className="text-sm">{customer.address || '—'}</p>
              <p className="mt-2 text-xs text-muted-foreground">Status: {customer.cus_status}</p>
            </section>

            <section id="orders" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">
                ORDER HISTORY ({ordersLoading ? '…' : orders.length})
              </h2>
              {ordersLoading ? (
                <p className="text-sm text-muted-foreground">Loading orders…</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No orders yet.{' '}
                  <Link href="/shop" className="text-accent-brand">
                    Start shopping
                  </Link>
                  .
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.order_id}
                      className="flex items-center justify-between border border-border p-3"
                    >
                      <div>
                        <div className="font-semibold">#{o.order_id}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(getOrderDate(o)).toLocaleDateString()} ·{' '}
                          {o.billDetails?.length ?? 0} items
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(o.price ?? 0)}</div>
                        <span className="bg-secondary px-2 py-0.5 text-xs">
                          {formatStatusLabel(o.shipping_status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="password" className="border border-border p-6">
              <h2 className="mb-4 font-display text-xl">CHANGE PASSWORD</h2>
              <form onSubmit={handlePasswordSubmit} className="max-w-sm space-y-3">
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2"
                  required
                  minLength={4}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
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
                  {updatingPassword ? 'Updating…' : 'Update'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
