'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useCartItems, useMounted } from '@/hooks/useCartCount';
import { removeFromCart, updateQuantity } from '@/redux/slices/cartSlice';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductImageUrl } from '@/utils/getProductImageUrl';
import { productService } from '@/services/product.api';
import type { Product } from '@/types/product.type';

function parsePrice(price?: string) {
  return Number(price ?? 0);
}

function CartProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const url = getProductImageUrl(src);

  if (!url || failed) {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-secondary font-display text-4xl opacity-30">
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={96}
      height={96}
      className="h-24 w-24 shrink-0 border border-border object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cart = useCartItems();
  const mounted = useMounted();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchFailed, setFetchFailed] = useState(false);

  const loadingProducts = cart.length > 0 && products.length === 0 && !fetchFailed;

  useEffect(() => {
    let cancelled = false;

    productService
      .getAll()
      .then((items) => {
        if (!cancelled) {
          setFetchFailed(false);
          setProducts(items);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setFetchFailed(true);
          const message = err instanceof Error ? err.message : 'Failed to load products';
          toast.error(message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const product of products) {
      map.set(String(product.pro_id), product);
    }
    return map;
  }, [products]);

  const enriched = useMemo(
    () =>
      cart
        .map((item) => {
          const product = productMap.get(item.productId);
          return product ? { ...item, product } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item != null),
    [cart, productMap],
  );

  const subtotal = enriched.reduce(
    (sum, item) => sum + parsePrice(item.product.pro_price) * item.quantity,
    0,
  );
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + shipping;

  if (!mounted || loadingProducts) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center text-muted-foreground">Loading cart…</div>
      </CustomerLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <CustomerLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-6 font-display text-4xl">YOUR CART IS EMPTY</h1>
          <p className="mt-2 text-muted-foreground">Add some gear and come back.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block bg-primary px-8 py-3 font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand"
          >
            Shop Now
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  if (fetchFailed) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center text-destructive">Failed to load cart products.</div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-4xl md:text-5xl">YOUR CART</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {enriched.length === 0 ? (
              <div className="border border-border p-8 text-center text-muted-foreground">
                No valid products in your cart.
              </div>
            ) : (
              enriched.map((item) => {
                const name = item.product.pro_name ?? 'Product';
                const price = parsePrice(item.product.pro_price);
                const maxQty = Math.max(1, item.product.pro_qty);

                return (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-4 border border-border p-4"
                  >
                    <CartProductImage src={item.product.pro_image} alt={name} />
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.productId}`}
                        className="font-semibold hover:text-accent-brand"
                      >
                        {name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' · '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="mt-1 font-bold text-accent-brand">{formatCurrency(price)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: item.productId,
                              size: item.size,
                              color: item.color,
                            }),
                          )
                        }
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                quantity: Math.max(1, item.quantity - 1),
                                size: item.size,
                                color: item.color,
                              }),
                            )
                          }
                          className="px-2 py-1 hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="border-x border-border px-3 py-1 text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                quantity: Math.min(maxQty, item.quantity + 1),
                                size: item.size,
                                color: item.color,
                              }),
                            )
                          }
                          disabled={item.quantity >= maxQty}
                          className="px-2 py-1 hover:bg-secondary disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <aside className="sticky top-24 h-fit border border-border p-6">
            <h2 className="mb-4 font-display text-2xl">ORDER SUMMARY</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatCurrency(5000 - subtotal)} more for free shipping
                </p>
              )}
            </div>
            <div className="my-4 flex justify-between border-t border-border pt-4 font-display text-xl">
              <span>Total</span>
              <span className="text-accent-brand">{formatCurrency(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="block bg-primary py-3 text-center font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand"
            >
              Checkout
            </Link>
          </aside>
        </div>
      </div>
    </CustomerLayout>
  );
}
