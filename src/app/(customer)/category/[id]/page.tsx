'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProductCard } from '@/components/product/ProductCard';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { categoryService } from '@/services/category.api';
import { productService } from '@/services/product.api';
import type { Category } from '@/types/category.type';
import { getCategoryLabel } from '@/types/category.type';
import type { Product } from '@/types/product.type';
import { lo } from '@/lib/lao';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const cateId = Number(id);
  const validId = Number.isFinite(cateId) && cateId > 0;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [failedCateId, setFailedCateId] = useState<number | null>(null);

  const notFound = validId && failedCateId === cateId;
  const loading = validId && category?.cate_id !== cateId && failedCateId !== cateId;

  useEffect(() => {
    if (!validId) return;

    let cancelled = false;

    Promise.all([categoryService.getById(cateId), productService.getByCateId(cateId)])
      .then(([categoryItem, productItems]) => {
        if (cancelled) return;
        setFailedCateId(null);
        setCategory(categoryItem);
        setProducts(productItems);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setCategory(null);
        setProducts([]);
        setFailedCateId(cateId);
        const message = err instanceof Error ? err.message : lo.toast.failedLoadCategory;
        toast.error(message);
      });

    return () => {
      cancelled = true;
    };
  }, [cateId, validId]);

  if (!validId) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center">
          <h1 className="font-display text-4xl">{lo.category.notFound}</h1>
          <Link href="/shop" className="mt-4 inline-block text-accent-brand underline">
            {lo.common.backToShop}
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  if (loading) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center text-muted-foreground">{lo.category.loadingOne}</div>
      </CustomerLayout>
    );
  }

  if (notFound || !category) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center">
          <h1 className="font-display text-4xl">{lo.category.notFound}</h1>
          <Link href="/shop" className="mt-4 inline-block text-accent-brand underline">
            {lo.common.backToShop}
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const label = getCategoryLabel(category);

  return (
    <CustomerLayout>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <span className="font-display text-7xl opacity-40">{label.charAt(0)}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-brand">{lo.category.label}</p>
            <h1 className="mt-1 font-display text-5xl md:text-6xl">{label.toUpperCase()}</h1>
            <p className="mt-2 opacity-70">
              {lo.shop.products(products.length)}
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            {lo.category.noProducts}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.pro_id} product={p} />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
