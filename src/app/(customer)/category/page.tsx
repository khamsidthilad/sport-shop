'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { categoryService } from '@/services/category.api';
import { productService } from '@/services/product.api';
import type { Category } from '@/types/category.type';
import { getCategoryHref, getCategoryLabel } from '@/types/category.type';
import type { Product } from '@/types/product.type';
import { lo } from '@/lib/lao';

function countProductsByCategory(products: Product[], cateId: number) {
  return products.filter((p) => p.cate_id === cateId).length;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([categoryService.getAll(), productService.getAll()])
      .then(([categoryItems, productItems]) => {
        if (cancelled) return;
        setCategories(categoryItems);
        setProducts(productItems);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : lo.toast.failedLoadCategories;
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

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => getCategoryLabel(a).localeCompare(getCategoryLabel(b))),
    [categories],
  );

  return (
    <CustomerLayout>
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl">{lo.category.allTitle}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">{lo.category.loading}</div>
        ) : sortedCategories.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">{lo.home.noCategories}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sortedCategories.map((c) => {
              const href = getCategoryHref(c);
              if (!href) return null;

              const label = getCategoryLabel(c);
              const count = countProductsByCategory(products, c.cate_id);

              return (
                <Link
                  key={c.cate_id}
                  href={href}
                  className="group flex aspect-square flex-col items-center justify-center border border-border bg-linear-to-br from-secondary to-muted transition-all hover:border-accent-brand hover:shadow-bold"
                >
                  <span className="font-display text-6xl opacity-30 group-hover:scale-110 transition-transform">
                    {label.charAt(0)}
                  </span>
                  <h3 className="mt-3 px-2 text-center font-display text-xl">{label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lo.shop.products(count)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
