'use client';

import { useEffect, useMemo, useState } from 'react';
import { Package, FolderTree, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { toast } from 'sonner';
import { categoryService } from '@/services/category.api';
import { customerService } from '@/services/customer.api';
import { orderService } from '@/services/order.api';
import { productService } from '@/services/product.api';
import type { Category } from '@/types/category.type';
import {
  formatStatusLabel,
  getOrderCustomerName,
  getOrderDate,
  type Order,
} from '@/types/order.type';
import type { Product } from '@/types/product.type';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  buildCategorySales,
  buildMonthlySales,
  getRecentOrders,
  getTotalRevenue,
} from '@/utils/dashboardStats';

const COLORS = [
  'oklch(0.62 0.24 25)',
  'oklch(0.08 0 0)',
  'oklch(0.45 0 0)',
  'oklch(0.7 0.15 50)',
  'oklch(0.55 0.18 200)',
  'oklch(0.6 0.18 140)',
  'oklch(0.65 0.2 280)',
  'oklch(0.55 0.15 320)',
];

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      customerService.getAll(),
      orderService.getReport(),
    ])
      .then(([productItems, categoryItems, customerItems, orderItems]) => {
        if (cancelled) return;
        setProducts(productItems);
        setCategories(categoryItems);
        setCustomerCount(customerItems.length);
        setOrders(orderItems);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
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

  const monthly = useMemo(() => buildMonthlySales(orders), [orders]);
  const catSales = useMemo(
    () => buildCategorySales(orders, categories, products),
    [orders, categories, products],
  );
  const revenue = useMemo(() => getTotalRevenue(orders), [orders]);
  const recentOrders = useMemo(() => getRecentOrders(orders), [orders]);

  const stats = [
    { label: 'Total Products', value: loading ? '…' : products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Categories', value: loading ? '…' : categories.length, icon: FolderTree, color: 'bg-green-500' },
    { label: 'Total Customers', value: loading ? '…' : customerCount, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Orders', value: loading ? '…' : orders.length, icon: ShoppingBag, color: 'bg-orange-500' },
    {
      label: 'Total Revenue',
      value: loading ? '…' : formatCurrency(revenue),
      icon: TrendingUp,
      color: 'bg-accent-brand',
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-display text-4xl">DASHBOARD</h1>
        <p className="text-muted-foreground">
          {loading ? 'Loading dashboard data…' : "Welcome back, here's what's happening."}
        </p>
      </div>

      {error && (
        <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="border border-border bg-card p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center text-white ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-display text-2xl">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-xl">MONTHLY SALES (REVENUE)</h3>
          {loading ? (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              Loading chart…
            </div>
          ) : monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                <XAxis dataKey="month" stroke="oklch(0.45 0 0)" />
                <YAxis stroke="oklch(0.45 0 0)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="oklch(0.62 0.24 25)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              No monthly sales data available.
            </div>
          )}
        </div>

        <div className="border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-xl">ORDERS PER MONTH</h3>
          {loading ? (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              Loading chart…
            </div>
          ) : monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                <XAxis dataKey="month" stroke="oklch(0.45 0 0)" />
                <YAxis stroke="oklch(0.45 0 0)" />
                <Tooltip />
                <Bar dataKey="orders" fill="oklch(0.08 0 0)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              No monthly order data available.
            </div>
          )}
        </div>

        <div className="border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-xl">SALES BY CATEGORY</h3>
          {loading ? (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              Loading chart…
            </div>
          ) : catSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={catSales} dataKey="sales" nameKey="name" outerRadius={90} label>
                  {catSales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              No category sales available.
            </div>
          )}
        </div>

        <div className="border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-xl">RECENT ORDERS</h3>
          {loading ? (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              Loading orders…
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0"
                >
                  <div>
                    <div className="font-semibold">#{order.order_id}</div>
                    <div className="text-xs text-muted-foreground">{getOrderCustomerName(order)}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(getOrderDate(order)).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(Number(order.price ?? 0))}</div>
                    <div className="text-xs">{formatStatusLabel(order.shipping_status)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-65 items-center justify-center text-sm text-muted-foreground">
              No recent orders available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
