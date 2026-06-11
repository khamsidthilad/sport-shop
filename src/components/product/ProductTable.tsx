'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setItems } from '@/redux/slices/productSlice';
import { productService } from '@/services/product.api';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductImageUrl } from '@/utils/getProductImageUrl';
import type { Product } from '@/types/product.type';
import Image from 'next/image';
import { lo } from '@/lib/lao';
const PER_PAGE = 10;

function parsePrice(price?: string) {
  return Number(price ?? 0);
}

function ProductImageInner({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const url = getProductImageUrl(src);

  if (!url || failed) {
    return (
      <div className="w-10 h-10 bg-secondary border border-border flex items-center justify-center text-[10px] text-muted-foreground">
        {lo.common.na}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={50}
      height={50}
      className="w-10 h-10 object-cover border border-border"
      onError={() => setFailed(true)}
    />
  );
}

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  return <ProductImageInner key={src ?? 'empty'} src={src} alt={alt} />;
}

interface ProductTableProps {
  onEdit: (product: Product) => void;
}

export default function ProductTable({ onEdit }: ProductTableProps) {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.product.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const items = await productService.getAll();
        if (!cancelled) dispatch(setItems(items));
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : lo.toast.failedLoadProducts;
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadProducts();

    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        void loadProducts();
      }
    };

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, [dispatch]);

  const filtered = products.filter((p) =>
    (p.pro_name ?? '').toLowerCase().includes(search.toLowerCase()),
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const handleDelete = async (product: Product) => {
    if (!confirm(lo.product.deleteConfirm(product.pro_name ?? lo.common.product))) return;

    setDeletingId(product.pro_id);
    try {
      await productService.delete(product.pro_id);
      dispatch(setItems(products.filter((p) => p.pro_id !== product.pro_id)));
      toast.success(lo.product.deleted);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : lo.toast.failedDeleteProduct;
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border p-12 text-center text-muted-foreground">
        {lo.admin.loadingProducts}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3">
          {error}
        </p>
      )}

      <div className="bg-card border border-border">
        <div className="p-4 border-b border-border flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={lo.shop.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 border border-border bg-background"
            />
          </div>
          <p className="self-center text-sm text-muted-foreground">{lo.admin.total(filtered.length)}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-3">{lo.admin.id}</th>
                <th className="text-left p-3">{lo.product.image}</th>
                <th className="text-left p-3">{lo.common.product}</th>
                <th className="text-left p-3">{lo.product.brand}</th>
                <th className="text-left p-3">{lo.product.category}</th>
                <th className="text-right p-3">{lo.common.price}</th>
                <th className="text-right p-3">{lo.product.stock}</th>
                <th className="text-center p-3">{lo.common.status}</th>
                <th className="text-right p-3">{lo.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    {lo.product.noProducts}
                  </td>
                </tr>
              ) : (
                paged.map((p) => {
                  const inStock = p.pro_qty > 0;
                  const isDeleting = deletingId === p.pro_id;

                  return (
                    <tr key={p.pro_id} className="border-t border-border hover:bg-secondary/50">
                      <td className="p-3 font-mono text-xs">{p.pro_id}</td>
                      <td className="p-3">
                        <ProductImage src={p.pro_image} alt={p.pro_name ?? lo.common.product} />
                      </td>
                      <td className="p-3 font-semibold">{p.pro_name ?? lo.common.na}</td>
                      <td className="p-3">{p.brand?.name ?? lo.common.na}</td>
                      <td className="p-3">{p.category?.cate_name ?? lo.common.na}</td>
                      <td className="p-3 text-right font-bold">
                        {formatCurrency(parsePrice(p.pro_price))}
                      </td>
                      <td className="p-3 text-right">{p.pro_qty}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-xs ${inStock ? 'bg-green-100 text-green-700' : 'bg-secondary'}`}
                        >
                          {inStock ? lo.product.inStockStatus : lo.product.outOfStock}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(p)}
                            disabled={isDeleting}
                            className="p-1.5 hover:bg-secondary disabled:opacity-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(p)}
                            disabled={isDeleting}
                            className="p-1.5 hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
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
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 border ${page === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
