'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setItems } from '@/redux/slices/customerSlice';
import { customerService } from '@/services/customer.api';
import { orderService } from '@/services/order.api';
import { buildOrderStatsByCustomer, type Order } from '@/types/order.type';
import { formatCurrency } from '@/utils/formatCurrency';
import { lo, statusLabel } from '@/lib/lao';

function matchCustomer(
  c: {
    cus_name?: string;
    Email?: string;
    Tel?: string;
    address?: string;
  },
  q: string,
) {
  return (
    (c.cus_name ?? '').toLowerCase().includes(q) ||
    (c.Email ?? '').toLowerCase().includes(q) ||
    (c.Tel ?? '').toLowerCase().includes(q) ||
    (c.address ?? '').toLowerCase().includes(q)
  );
}

export default function CustomerAdminClient() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((s) => s.customer.items);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([customerService.getAll(), orderService.getReport()])
      .then(([customerItems, orderItems]) => {
        if (cancelled) return;
        dispatch(setItems(customerItems));
        setOrders(orderItems);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : lo.toast.failedLoadCustomers;
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
  }, [dispatch]);

  const orderStats = useMemo(() => buildOrderStatsByCustomer(orders), [orders]);
  const filtered = customers.filter((c) => matchCustomer(c, search.toLowerCase()));
  const detail = customers.find((c) => c.cus_id === selected);
  const detailStats = detail ? orderStats.get(detail.cus_id) : undefined;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl">{lo.admin.customers}</h1>
        <p className="text-muted-foreground">
          {loading ? lo.common.loading : lo.admin.total(filtered.length)}
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-card border border-border">
          <div className="p-4 border-b border-border relative max-w-sm">
            <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lo.admin.searchCustomers}
              className="w-full pl-9 pr-3 py-2 border border-border bg-background"
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">{lo.admin.loadingCustomers}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">{lo.admin.noCustomers}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase">
                <tr>
                  <th className="text-left p-3">{lo.common.name}</th>
                  <th className="text-left p-3">{lo.common.email}</th>
                  <th className="text-left p-3">{lo.common.tel}</th>
                  <th className="text-left p-3">{lo.common.status}</th>
                  <th className="text-right p-3">{lo.admin.ordersShort}</th>
                  <th className="p-3">{lo.admin.joined}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.cus_id}
                    onClick={() => setSelected(c.cus_id)}
                    className={`border-t border-border cursor-pointer hover:bg-secondary/50 ${
                      selected === c.cus_id ? 'bg-secondary' : ''
                    }`}
                  >
                    <td className="p-3 font-semibold">{c.cus_name}</td>
                    <td className="p-3">{c.Email || lo.common.na}</td>
                    <td className="p-3">{c.Tel || lo.common.na}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-xs bg-secondary">{statusLabel(c.cus_status)}</span>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {orderStats.get(c.cus_id)?.count ?? 0}
                    </td>
                    <td className="p-3 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <aside className="bg-card border border-border p-5 h-fit">
          <h3 className="font-display text-xl mb-3">{lo.admin.customerDetail}</h3>
          {!detail ? (
            <p className="text-sm text-muted-foreground">{lo.admin.selectCustomer}</p>
          ) : (
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{lo.admin.id}: </span>
                <span className="font-mono">{detail.cus_id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{lo.common.name}: </span>
                <span className="font-semibold">{detail.cus_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{lo.common.email}: </span>
                {detail.Email || lo.common.na}
              </div>
              <div>
                <span className="text-muted-foreground">{lo.common.tel}: </span>
                {detail.Tel || lo.common.na}
              </div>
              <div>
                <span className="text-muted-foreground">{lo.common.status}: </span>
                {statusLabel(detail.cus_status)}
              </div>
              <div>
                <span className="text-muted-foreground">{lo.common.address}: </span>
                {detail.address || lo.common.na}
              </div>
              <div>
                <span className="text-muted-foreground">{lo.admin.updated} </span>
                {new Date(detail.updatedAt).toLocaleDateString()}
              </div>
              <div className="pt-3 border-t border-border mt-3 space-y-1">
                <div>
                  <span className="text-muted-foreground">{lo.admin.totalOrdersLabel} </span>
                  <span className="font-semibold">{detailStats?.count ?? 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{lo.admin.totalSpent} </span>
                  <span className="font-semibold">
                    {formatCurrency(detailStats?.total ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
