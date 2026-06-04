'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { addToCart } from '@/redux/slices/cartSlice';
import { formatCurrency } from '@/utils/formatCurrency';
import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const brand = useAppSelector((s) => s.brand.items.find((b) => b.id === product.brandId));
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-card border border-border overflow-hidden transition-all hover:shadow-bold hover:-translate-y-1">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-secondary to-muted overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 group-hover:scale-110 transition-transform duration-500">
            {product.name.charAt(0)}
          </div>
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-accent-brand text-accent-foreground text-xs font-bold px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1">
              NEW
            </span>
          )}
          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="font-display text-2xl">OUT OF STOCK</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{brand?.name}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold mt-1 line-clamp-2 hover:text-accent-brand transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 text-sm">
          <Star className="w-4 h-4 fill-accent-brand text-accent-brand" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-accent-brand">
                  {formatCurrency(product.discountPrice)}
                </span>
                <span className="ml-2 text-sm line-through text-muted-foreground">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            disabled={product.quantity === 0}
            onClick={() => {
              dispatch(
                addToCart({
                  productId: product.id,
                  quantity: 1,
                  size: product.sizes[0],
                  color: product.colors[0],
                }),
              );
              toast.success('Added to cart');
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 text-sm font-semibold hover:bg-accent-brand transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" /> Add
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center w-10 border border-border hover:bg-secondary transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
