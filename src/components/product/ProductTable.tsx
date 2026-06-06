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
        N/A
      </div>
    );
  }

  return (
    <img
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

  const loadProducts = async (cancelledRef?: { current: boolean }) => {
    try {
      const items = await productService.getAll();
      if (!cancelledRef?.current) dispatch(setItems(items));
    } catch (err: unknown) {
      if (!cancelledRef?.current) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
        toast.error(message);
      }
    } finally {
      if (!cancelledRef?.current) setLoading(false);
    }
  };

  useEffect(() => {
    const cancelled = { current: false };
    void loadProducts(cancelled);

    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') {
        void loadProducts();
      }
    };

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      cancelled.current = true;
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
    if (!confirm(`Delete "${product.pro_name ?? 'this product'}"?`)) return;

    setDeletingId(product.pro_id);
    try {
      await productService.delete(product.pro_id);
      dispatch(setItems(products.filter((p) => p.pro_id !== product.pro_id)));
      toast.success('Product deleted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border p-12 text-center text-muted-foreground">
        Loading products…
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
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 border border-border bg-background"
            />
          </div>
          <p className="self-center text-sm text-muted-foreground">{filtered.length} total</p>
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
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    No products found.
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
                        <ProductImage src={p.pro_image} alt={p.pro_name ?? 'Product'} />
                      </td>
                      <td className="p-3 font-semibold">{p.pro_name ?? '—'}</td>
                      <td className="p-3">{p.brand?.name ?? '—'}</td>
                      <td className="p-3">{p.category?.cate_name ?? '—'}</td>
                      <td className="p-3 text-right font-bold">
                        {formatCurrency(parsePrice(p.pro_price))}
                      </td>
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
