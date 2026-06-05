'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setItems } from '@/redux/slices/productSlice';
import { productService } from '@/services/product.api';
import type { Brand, Category, Product } from '@/types/product.type';
import ProductTable from '@/components/product/ProductTable';
import ProductForm from '@/components/product/ProductForm';

const PER_PAGE = 10;

function collectCategories(products: Product[]): Category[] {
  const map = new Map<number, Category>();
  for (const p of products) {
    if (p.category) map.set(p.category.cate_id, p.category);
  }
  return Array.from(map.values());
}

function collectBrands(products: Product[]): Brand[] {
  const map = new Map<number, Brand>();
  for (const p of products) {
    if (p.brand) map.set(p.brand.brand_id, p.brand);
  }
  return Array.from(map.values());
}

export default function ProductMgmt() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.product.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    productService
      .getAll()
      .then((items) => {
        if (!cancelled) dispatch(setItems(items));
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load products';
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

  const categories = useMemo(() => collectCategories(products), [products]);
  const brands = useMemo(() => collectBrands(products), [products]);

  const filtered = products.filter((p) =>
    (p.pro_name ?? '').toLowerCase().includes(search.toLowerCase()),
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSave = (data: Product) => {
    dispatch(setItems(products.map((p) => (p.pro_id === data.pro_id ? data : p))));
    toast.success('Product updated');
    closeModal();
  };

  const handleDelete = (product: Product) => {
    if (!confirm(`Delete "${product.pro_name ?? 'this product'}"?`)) return;
    dispatch(setItems(products.filter((p) => p.pro_id !== product.pro_id)));
    toast.success('Product deleted');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">PRODUCTS</h1>
          <p className="text-muted-foreground">
            {loading ? 'Loading…' : `${filtered.length} total`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-accent-brand text-accent-foreground px-4 py-2 font-bold uppercase text-sm tracking-wider hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground">
          Loading products…
        </div>
      ) : (
        <ProductTable
          products={paged}
          totalCount={filtered.length}
          search={search}
          onSearchChange={setSearch}
          page={page}
          onPageChange={setPage}
          perPage={PER_PAGE}
          onEdit={(p) => {
            setEditing(p);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {open && (
        <ProductForm
          product={editing}
          categories={categories}
          brands={brands}
          onSave={handleSave}
          onCreated={() => setPage(1)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
