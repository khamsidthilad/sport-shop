'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { productService } from '@/services/product.api';
import type { Brand } from '@/types/brand.type';
import type { Product } from '@/types/product.type';
import { lo } from '@/lib/lao';

export default function BrandsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    productService
      .getAll()
      .then((productItems) => {
        if (cancelled) return;
        setProducts(productItems);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : lo.toast.failedLoadBrands;
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { brands, productCountByBrand } = useMemo(() => {
    const brandMap = new Map<number, Brand>();
    const counts = new Map<number, number>();

    for (const product of products) {
      if (product.brand_id == null) continue;
      counts.set(product.brand_id, (counts.get(product.brand_id) ?? 0) + 1);
      if (product.brand) {
        brandMap.set(product.brand_id, product.brand);
      }
    }

    return {
      brands: Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      productCountByBrand: counts,
    };
  }, [products]);

  if (loading) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center text-muted-foreground">{lo.brandPage.loading}</div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center text-destructive">{error}</div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl">{lo.brandPage.title}</h1>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {brands.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {lo.brandPage.noBrands}
          </div>
        ) : (
          brands.map((b) => {
            const count = productCountByBrand.get(b.brand_id) ?? 0;
            return (
              <Link
                key={b.brand_id}
                href={`/shop?brand=${b.brand_id}`}
                className="border border-border p-6 transition-all hover:border-accent-brand hover:shadow-bold"
              >
                <div className="font-display text-3xl">{b.name}</div>
                <p className="mt-1 text-sm text-accent-brand">{b.tagline}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {b.country} · {lo.shop.products(count)}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </CustomerLayout>
  );
}
