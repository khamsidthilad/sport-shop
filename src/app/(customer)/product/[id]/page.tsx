'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/redux/slices/cartSlice';
import { ProductCard } from '@/components/product/ProductCard';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductImageUrl } from '@/utils/getProductImageUrl';
import { productService } from '@/services/product.api';
import { PRODUCT_COLORS, PRODUCT_SIZES } from '@/constants/productOptions';
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
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-secondary to-muted font-display text-[16rem] opacity-20">
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      priority
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const proId = Number(id);
  const validId = Number.isFinite(proId) && proId > 0;

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [failedProId, setFailedProId] = useState<number | null>(null);

  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);

  const loading = validId && product?.pro_id !== proId && failedProId !== proId;
  const notFound = validId && failedProId === proId;

  useEffect(() => {
    if (!validId) return;

    let cancelled = false;

    productService
      .getById(proId)
      .then(async (productItem) => {
        if (cancelled) return;
        setFailedProId(null);
        setProduct(productItem);

        try {
          const all = await productService.getAll();
          if (cancelled) return;
          setRelated(
            all
              .filter(
                (p) =>
                  productItem.cate_id != null &&
                  p.cate_id === productItem.cate_id &&
                  p.pro_id !== productItem.pro_id,
              )
              .slice(0, 4),
          );
        } catch {
          if (!cancelled) setRelated([]);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setProduct(null);
        setRelated([]);
        setFailedProId(proId);
        const message = err instanceof Error ? err.message : lo.toast.failedLoadProduct;
        toast.error(message);
      });

    return () => {
      cancelled = true;
    };
  }, [proId, validId]);

  if (!validId) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center">
          <h1 className="font-display text-4xl">{lo.product.notFound}</h1>
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
        <div className="py-20 text-center text-muted-foreground">{lo.product.loading}</div>
      </CustomerLayout>
    );
  }

  if (notFound || !product) {
    return (
      <CustomerLayout>
        <div className="py-20 text-center">
          <h1 className="font-display text-4xl">{lo.product.notFound}</h1>
          <Link href="/shop" className="mt-4 inline-block text-accent-brand underline">
            {lo.common.backToShop}
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const name = product.pro_name ?? lo.common.product;
  const price = parsePrice(product.pro_price);
  const inStock = product.pro_qty > 0;

  const handleAdd = (buyNow = false) => {
    if (PRODUCT_SIZES.length > 1 && !size) {
      toast.error(lo.product.selectSize);
      return;
    }
    if (PRODUCT_COLORS.length > 1 && !color) {
      toast.error(lo.product.selectColor);
      return;
    }

    dispatch(
      addToCart({
        productId: String(product.pro_id),
        quantity: qty,
        size: size || PRODUCT_SIZES[0],
        color: color || PRODUCT_COLORS[0].name,
      }),
    );
    toast.success(lo.product.addedToCart);
    if (buyNow) router.push('/cart');
  };

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent-brand">
            {lo.nav.home}
          </Link>{' '}
          /{' '}
          <Link href="/shop" className="hover:text-accent-brand">
            {lo.nav.shop}
          </Link>{' '}
          / {name}
        </nav>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden bg-linear-to-br from-secondary to-muted">
              <ProductImage src={product.pro_image} alt={name} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-brand">
              {product.brand?.name ?? lo.common.na} · {product.category?.cate_name ?? lo.common.uncategorized}
            </p>
            <h1 className="font-display mt-2 text-4xl md:text-5xl">{name}</h1>
            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl text-accent-brand">{formatCurrency(price)}</span>
            </div>
            <p
              className={`mt-3 text-sm font-semibold ${inStock ? 'text-green-600' : 'text-destructive'}`}
            >
              {inStock ? lo.product.inStock(product.pro_qty) : lo.product.outOfStock}
            </p>
            {product.pro_detail && (
              <p className="mt-6 text-muted-foreground">{product.pro_detail}</p>
            )}

            <div className="mt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest">{lo.product.size}</p>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`min-w-12 border px-4 py-2 text-sm font-semibold ${
                      size === s
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest">{lo.product.color}</p>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    className={`flex items-center gap-2 border px-4 py-2 text-sm ${
                      color === c.name
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-widest">{lo.common.quantity}</p>
              <div className="flex border border-border">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 hover:bg-secondary"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="border-x border-border px-4 py-2 font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(product.pro_qty, qty + 1))}
                  disabled={!inStock || qty >= product.pro_qty}
                  className="px-3 py-2 hover:bg-secondary disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleAdd(false)}
                disabled={!inStock}
                className="flex-1 bg-primary py-4 font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-50"
              >
                {lo.product.addToCart}
              </button>
              <button
                type="button"
                onClick={() => handleAdd(true)}
                disabled={!inStock}
                className="flex-1 bg-accent-brand py-4 font-bold uppercase tracking-wider text-accent-foreground hover:opacity-90 disabled:opacity-50"
              >
                {lo.product.buyNow}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 text-xs sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent-brand" /> {lo.product.freeShipping}
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent-brand" /> {lo.product.authentic}
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-accent-brand" /> {lo.product.returns}
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display mb-6 text-3xl">{lo.product.related}</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.pro_id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
