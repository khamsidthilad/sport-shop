'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setItems as setBrandItems } from '@/redux/slices/brandSlice';
import { setItems as setCategoryItems } from '@/redux/slices/categorySlice';
import { setItems as setProductItems } from '@/redux/slices/productSlice';
import { categoryService } from '@/services/category.api';
import { productService } from '@/services/product.api';
import { ProductCard } from '@/components/product/ProductCard';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import type { Brand } from '@/types/brand.type';
import type { Product } from '@/types/product.type';

function parsePrice(price?: string) {
  return Number(price ?? 0);
}

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const products = useAppSelector((s) => s.product.items);
  const categories = useAppSelector((s) => s.category.items);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [catId, setCatId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    const brand = searchParams.get('brand');
    if (brand) setBrandId(brand);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([productItems, categoryItems]) => {
        if (cancelled) return;
        dispatch(setProductItems(productItems));
        dispatch(setCategoryItems(categoryItems));

        const brandMap = new Map<number, Brand>();
        for (const product of productItems) {
          if (product.brand && product.brand_id != null) {
            brandMap.set(product.brand_id, product.brand);
          }
        }
        dispatch(setBrandItems(Array.from(brandMap.values())));

        const highestPrice = productItems.reduce(
          (max, p) => Math.max(max, parsePrice(p.pro_price)),
          0,
        );
        if (highestPrice > 0) {
          setMaxPrice(Math.max(10000, Math.ceil(highestPrice / 500) * 500));
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load shop';
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

  const brands = useMemo(() => {
    const map = new Map<number, Brand>();
    for (const product of products) {
      if (product.brand && product.brand_id != null) {
        map.set(product.brand_id, product.brand);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const priceCeiling = useMemo(() => {
    const highest = products.reduce((max, p) => Math.max(max, parsePrice(p.pro_price)), 10000);
    return Math.max(10000, Math.ceil(highest / 500) * 500);
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p: Product) => {
      const name = (p.pro_name ?? '').toLowerCase();
      if (search && !name.includes(search.toLowerCase())) return false;
      if (catId && String(p.cate_id) !== catId) return false;
      if (brandId && String(p.brand_id) !== brandId) return false;
      if (parsePrice(p.pro_price) > maxPrice) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => parsePrice(a.pro_price) - parsePrice(b.pro_price));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => parsePrice(b.pro_price) - parsePrice(a.pro_price));
        break;
      case 'name':
        list = [...list].sort((a, b) =>
          (a.pro_name ?? '').localeCompare(b.pro_name ?? ''),
        );
        break;
    }

    return list;
  }, [products, search, catId, brandId, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <CustomerLayout>
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl">SHOP ALL</h1>
          <p className="mt-2 opacity-70">
            {loading ? 'Loading…' : `${filtered.length} products`}
          </p>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="space-y-6">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Search className="h-4 w-4" /> Search
            </label>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="w-full border border-border bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <SlidersHorizontal className="h-4 w-4" /> Category
            </label>
            <select
              value={catId}
              onChange={(e) => {
                setCatId(e.target.value);
                setPage(1);
              }}
              className="w-full border border-border bg-background px-3 py-2"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.cate_id} value={String(c.cate_id)}>
                  {c.cate_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest">Brand</label>
            <select
              value={brandId}
              onChange={(e) => {
                setBrandId(e.target.value);
                setPage(1);
              }}
              className="w-full border border-border bg-background px-3 py-2"
            >
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b.brand_id} value={String(b.brand_id)}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest">
              Max Price: ฿{maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min={500}
              max={priceCeiling}
              step={500}
              value={Math.min(maxPrice, priceCeiling)}
              onChange={(e) => setMaxPrice(+e.target.value)}
              className="w-full accent-[oklch(0.62_0.24_25)]"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCatId('');
              setBrandId('');
              setMaxPrice(priceCeiling);
              setPage(1);
            }}
            className="w-full border border-border py-2 text-sm font-semibold uppercase hover:bg-secondary"
          >
            Reset Filters
          </button>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {loading ? 'Loading products…' : `Showing ${paged.length} of ${filtered.length}`}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading products…</div>
          ) : paged.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {paged.map((p) => (
                <ProductCard key={p.pro_id} product={p} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`h-10 w-10 border ${
                    page === i + 1
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
