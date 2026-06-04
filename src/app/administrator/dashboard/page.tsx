'use client';

import { Package, FolderTree, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';

const COLORS = ['oklch(0.62 0.24 25)', 'oklch(0.08 0 0)', 'oklch(0.45 0 0)', 'oklch(0.7 0.15 50)', 'oklch(0.55 0.18 200)', 'oklch(0.6 0.18 140)', 'oklch(0.65 0.2 280)', 'oklch(0.55 0.15 320)'];

export default function Dashboard() {
  const products = useAppSelector((s) => s.product.items);
  const categories = useAppSelector((s) => s.category.items);
  const customers = useAppSelector((s) => s.customer.items);
  const orders = useAppSelector((s) => s.order.items);
  const monthly = useAppSelector((s) => s.dashboard.monthlySales);
  const catSales = useAppSelector((s) => s.dashboard.categorySales);
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Categories', value: categories.length, icon: FolderTree, color: 'bg-green-500' },
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-orange-500' },
    { label: 'Total Revenue', value: formatCurrency(revenue), icon: TrendingUp, color: 'bg-accent-brand' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-4xl">DASHBOARD</h1>
        <p className="text-muted-foreground">Welcome back, here&apos;s what&apos;s happening.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border p-5">
            <div className={`w-10 h-10 ${s.color} text-white flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="font-display text-2xl mt-1">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6">
          <h3 className="font-display text-xl mb-4">MONTHLY SALES (REVENUE)</h3>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                <XAxis dataKey="month" stroke="oklch(0.45 0 0)" />
                <YAxis stroke="oklch(0.45 0 0)" />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="oklch(0.62 0.24 25)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="min-h-65 flex items-center justify-center text-sm text-muted-foreground">
              No monthly sales data available.
            </div>
          )}
        </div>
        <div className="bg-card border border-border p-6">
          <h3 className="font-display text-xl mb-4">ORDERS PER MONTH</h3>
          {monthly.length > 0 ? (
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
            <div className="min-h-65 flex items-center justify-center text-sm text-muted-foreground">
              No monthly order data available.
            </div>
          )}
        </div>
        <div className="bg-card border border-border p-6">
          <h3 className="font-display text-xl mb-4">SALES BY CATEGORY</h3>
          {catSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={catSales} dataKey="sales" nameKey="name" outerRadius={90} label>
                  {catSales.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="min-h-65 flex items-center justify-center text-sm text-muted-foreground">
              No category sales available.
            </div>
          )}
        </div>
        <div className="bg-card border border-border p-6">
          <h3 className="font-display text-xl mb-4">RECENT ORDERS</h3>
          {orders.length > 0 ? (
            <div className="space-y-2">
              {orders.slice(0, 6).map((o) => (
                <div key={o.id} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm">
                  <div>
                    <div className="font-semibold">{o.id}</div>
                    <div className="text-xs text-muted-foreground">{o.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(o.total)}</div>
                    <div className="text-xs">{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-65 flex items-center justify-center text-sm text-muted-foreground">
              No recent orders available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
