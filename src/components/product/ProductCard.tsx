'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/redux/slices/cartSlice';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductImageUrl } from '@/utils/getProductImageUrl';
import type { Product } from '@/types/product.type';
import { lo } from '@/lib/lao';

function parsePrice(price?: string) {
  return Number(price ?? 0);
}

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const url = getProductImageUrl(src);

  if (!url || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-secondary to-muted font-display text-8xl opacity-20">
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, 25vw"
      className="object-cover transition-transform duration-500 group-hover:scale-110"
      onError={() => setFailed(true)}
    />
  );
}

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const name = product.pro_name ?? lo.common.product;
  const price = parsePrice(product.pro_price);
  const inStock = product.pro_qty > 0;
  const productHref =
    typeof product.pro_id === 'number' && product.pro_id > 0
      ? `/product/${product.pro_id}`
      : null;

  if (!productHref) {
    return null;
  }

  return (
    <div className="group relative overflow-hidden border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-bold">
      <Link href={productHref} className="block">
        <div className="relative aspect-square overflow-hidden bg-linear-to-br from-secondary to-muted">
          <ProductImage src={product.pro_image} alt={name} />
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="font-display text-2xl">{lo.product.outOfStockBadge}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {product.brand?.name ?? '—'}
        </p>
        <Link href={productHref}>
          <h3 className="mt-1 line-clamp-2 font-semibold transition-colors hover:text-accent-brand">
            {name}
          </h3>
        </Link>
        <p className="mt-2 text-xs text-muted-foreground">
          {product.category?.cate_name ?? lo.common.uncategorized}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-lg font-bold text-accent-brand">{formatCurrency(price)}</span>
          <span className={`text-xs ${inStock ? 'text-green-600' : 'text-destructive'}`}>
            {inStock ? lo.product.inStockShort(product.pro_qty) : lo.product.outOfStock}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={!inStock}
            onClick={() => {
              dispatch(
                addToCart({
                  productId: String(product.pro_id),
                  quantity: 1,
                  size: '',
                  color: '',
                }),
              );
              toast.success(lo.product.addedToCart);
            }}
            className="flex flex-1 items-center justify-center gap-2 bg-primary py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent-brand disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" /> {lo.common.add}
          </button>
          <Link
            href={productHref}
            className="flex w-10 items-center justify-center border border-border transition-colors hover:bg-secondary"
            aria-label={lo.product.viewProduct}
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
