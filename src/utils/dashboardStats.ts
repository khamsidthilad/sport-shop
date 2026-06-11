import { lo } from '@/lib/lao';
import type { Category } from '@/types/category.type';
import type { Order } from '@/types/order.type';
import type { Product } from '@/types/product.type';
import { isOrderCancelled } from '@/types/order.type';

export interface MonthlySalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface CategorySalesData {
  name: string;
  sales: number;
}

function getOrderTimestamp(order: Order): number {
  const value = order.date ?? order.createdAt;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

export function buildMonthlySales(orders: Order[]): MonthlySalesData[] {
  const byMonth = new Map<string, MonthlySalesData & { sortKey: string }>();

  for (const order of orders) {
    if (isOrderCancelled(order)) continue;

    const date = new Date(order.date ?? order.createdAt);
    if (Number.isNaN(date.getTime())) continue;

    const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const prev = byMonth.get(sortKey) ?? { month, sales: 0, orders: 0, sortKey };

    byMonth.set(sortKey, {
      ...prev,
      sales: prev.sales + Number(order.price ?? 0),
      orders: prev.orders + 1,
    });
  }

  return Array.from(byMonth.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ month, sales, orders: orderCount }) => ({
      month,
      sales,
      orders: orderCount,
    }));
}

export function buildCategorySales(
  orders: Order[],
  categories: Category[],
  products: Product[],
): CategorySalesData[] {
  const categoryNames = new Map(categories.map((category) => [category.cate_id, category.cate_name]));
  const productCategories = new Map(products.map((product) => [product.pro_id, product.cate_id]));
  const salesByCategory = new Map<string, number>();

  for (const order of orders) {
    if (isOrderCancelled(order)) continue;

    const details = order.billDetails ?? [];
    if (details.length === 0) {
      const fallback = salesByCategory.get(lo.common.other) ?? 0;
      salesByCategory.set(lo.common.other, fallback + Number(order.price ?? 0));
      continue;
    }

    for (const detail of details) {
      const proId = detail.Pro_id ?? detail.product?.pro_id;
      if (!proId) continue;

      const cateId = productCategories.get(proId);
      const name = cateId
        ? (categoryNames.get(cateId)?.trim() || `Category #${cateId}`)
        : lo.common.uncategorized;
      const amount = Number(detail.Total ?? 0);

      salesByCategory.set(name, (salesByCategory.get(name) ?? 0) + amount);
    }
  }

  return Array.from(salesByCategory.entries())
    .map(([name, sales]) => ({ name, sales }))
    .filter((item) => item.sales > 0)
    .sort((a, b) => b.sales - a.sales);
}

export function getTotalRevenue(orders: Order[]): number {
  return orders.reduce((sum, order) => {
    if (isOrderCancelled(order)) return sum;
    return sum + Number(order.price ?? 0);
  }, 0);
}

export function getRecentOrders(orders: Order[], limit = 6): Order[] {
  return [...orders].sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a)).slice(0, limit);
}
