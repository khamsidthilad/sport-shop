'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Search } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductImageUrl } from '@/utils/getProductImageUrl';
import type { Product } from '@/types/product.type';

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const url = getProductImageUrl(src);

  if (!url || failed) {
    return (
      <div className="w-10 h-10 bg-secondary border border-border flex items-center justify-center text-[10px] text-muted-foreground">
        N/A
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={40}
      height={40}
      className="object-cover border border-border"
      onError={() => setFailed(true)}
    />
  );
}

function parsePrice(price?: string) {
  return Number(price ?? 0);
}

interface ProductTableProps {
  products: Product[];
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  totalCount,
  search,
  onSearchChange,
  page,
  onPageChange,
  perPage,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / perPage));

  return (
    <div className="bg-card border border-border">
      <div className="p-4 border-b border-border flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 border border-border bg-background"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Brand</th>
              <th className="text-left p-3">Category</th>
              <th className="text-right p-3">Price</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-center p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const inStock = p.pro_qty > 0;
                return (
                  <tr key={p.pro_id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3 font-mono text-xs">{p.pro_id}</td>
                    <td className="p-3">
                      <ProductImage src={p.pro_image} alt={p.pro_name ?? 'Product'} />
                    </td>
                    <td className="p-3 font-semibold">{p.pro_name ?? '—'}</td>
                    <td className="p-3">{p.brand?.name ?? '—'}</td>
                    <td className="p-3">{p.category?.cate_name ?? '—'}</td>
                    <td className="p-3 text-right font-bold">{formatCurrency(parsePrice(p.pro_price))}</td>
                    <td className="p-3 text-right">{p.pro_qty}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs ${inStock ? 'bg-green-100 text-green-700' : 'bg-secondary'}`}
                      >
                        {inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          className="p-1.5 hover:bg-secondary"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p)}
                          className="p-1.5 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border flex justify-center gap-1">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 border ${page === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
