'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Headphones, RotateCcw, Shield, Truck } from 'lucide-react';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { ProductCard } from '@/components/product/ProductCard';
import type { Brand } from '@/types/brand.type';
import type { Category } from '@/types/category.type';
import { getCategoryHref, getCategoryLabel } from '@/types/category.type';
import type { Product } from '@/types/product.type';
import { getBrandImageUrl } from '@/utils/getProductImageUrl';
import { lo } from '@/lib/lao';

function parsePrice(price?: string) {
  return Number(price ?? 0);
}

function pickFeatured(products: Product[]) {
  return products.slice(0, 4);
}

function pickFlashSale(products: Product[]) {
  return [...products]
    .filter((p) => p.pro_qty > 0)
    .sort((a, b) => parsePrice(a.pro_price) - parsePrice(b.pro_price))
    .slice(0, 4);
}

function pickBestSellers(products: Product[]) {
  return [...products]
    .filter((p) => p.pro_qty > 0)
    .sort((a, b) => parsePrice(b.pro_price) - parsePrice(a.pro_price))
    .slice(0, 4);
}

function pickBrands(products: Product[], limit = 6): Brand[] {
  const map = new Map<number, Brand>();
  for (const product of products) {
    if (product.brand && product.brand_id != null) {
      map.set(product.brand_id, product.brand);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}

type HomePageClientProps = {
  categories: Category[];
  products: Product[];
};

export function HomePageClient({ categories, products }: HomePageClientProps) {
  const featured = pickFeatured(products);
  const flashSale = pickFlashSale(products);
  const bestSellers = pickBestSellers(products);
  const brands = pickBrands(products);

  return (
    <CustomerLayout>
      <section className="relative min-h-[85vh] overflow-hidden bg-primary text-primary-foreground">
        <Image
          src="/assets/hero-athlete.jpg"
          alt={lo.home.athleteAlt}
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-primary/20" />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="inline-flex w-fit rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-accent-brand backdrop-blur-sm">
            {lo.home.badge}
          </p>
          <h1 className="font-display mt-6 max-w-4xl text-balance text-6xl leading-[0.9] md:text-8xl lg:text-9xl">
            {lo.home.headline1}
            <br />
            <span className="text-accent-brand">{lo.home.headline2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
            {lo.home.heroBody}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-sm bg-accent-brand px-8 py-4 text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-bold transition hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
            >
              {lo.home.shopNow}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-sm border-2 border-primary-foreground/80 px-8 py-4 text-sm font-bold uppercase tracking-wider transition hover:bg-primary-foreground hover:text-primary"
            >
              {lo.home.explore}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, label: lo.home.freeShipping, sub: lo.home.freeShippingSub },
            { icon: Shield, label: lo.home.authentic, sub: lo.home.authenticSub },
            { icon: RotateCcw, label: lo.home.easyReturns, sub: lo.home.easyReturnsSub },
            { icon: Headphones, label: lo.home.support, sub: lo.home.supportSub },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-3">
              <p.icon className="w-8 h-8 text-accent-brand" />
              <div>
                <div className="font-semibold text-sm">{p.label}</div>
                <div className="text-xs text-muted-foreground">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-accent-brand font-bold tracking-widest text-xs">{lo.home.shopBySport}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2">{lo.home.chooseGame}</h2>
          </div>
          <Link
            href="/category"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold uppercase hover:text-accent-brand"
          >
            {lo.common.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {categories.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">{lo.home.noCategories}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((c) => {
              const href = getCategoryHref(c);
              if (!href) return null;

              const label = getCategoryLabel(c);

              return (
                <Link
                  key={c.cate_id}
                  href={href}
                  className="group relative aspect-square bg-linear-to-br from-secondary to-muted border border-border flex flex-col items-center justify-center hover:border-accent-brand hover:shadow-bold transition-all"
                >
                  <span className="font-display text-6xl opacity-30 group-hover:scale-110 transition-transform">
                    {label.charAt(0)}
                  </span>
                  <span className="mt-3 px-2 text-center font-display text-xl tracking-wider">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-accent-brand font-bold tracking-widest text-xs">{lo.home.featured}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2">{lo.home.hotRightNow}</h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold uppercase hover:text-accent-brand"
          >
            {lo.home.shopAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">{lo.home.noProducts}</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.pro_id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-accent-brand font-bold tracking-widest text-xs">{lo.home.limitedTime}</p>
            <h2 className="font-display text-5xl md:text-7xl mt-2 leading-none">
              {lo.home.flash}
              <br />
              {lo.home.sale}
            </h2>
            <p className="mt-4 opacity-80 max-w-md">
              {lo.home.flashBody}
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 bg-accent-brand px-6 py-3 text-sm font-bold uppercase text-accent-foreground"
            >
              {lo.home.shopDeals} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {flashSale.length === 0 ? (
            <div className="py-12 text-center opacity-80">{lo.home.noSaleItems}</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {flashSale.map((p) => (
                <ProductCard key={p.pro_id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-accent-brand font-bold tracking-widest text-xs">{lo.home.bestSellers}</p>
        <h2 className="font-display text-4xl md:text-5xl mt-2 mb-8">{lo.home.championPicks}</h2>
        {bestSellers.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">{lo.home.noProducts}</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.pro_id} product={p} />
            ))}
          </div>
        )}
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-accent-brand font-bold tracking-widest text-xs">{lo.home.trustedBy}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2">{lo.home.popularBrands}</h2>
          </div>
          <Link
            href="/brand"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold uppercase hover:text-accent-brand"
          >
            {lo.common.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {brands.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">{lo.home.noBrands}</div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {brands.map((b) => {
              const logoUrl = getBrandImageUrl(b.brand_logo);

              return (
                <Link
                  key={b.brand_id}
                  href={`/shop?brand=${b.brand_id}`}
                  className="aspect-video bg-secondary border border-border flex flex-col items-center justify-center gap-2 px-2 text-center font-display text-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {logoUrl ? (
                    <div className="relative h-10 w-20">
                      <Image
                        src={logoUrl}
                        alt={b.name}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span>{b.name.charAt(0)}</span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide">{b.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-brand">{lo.home.fastDelivery}</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              {lo.home.shopConfidence}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {lo.home.browseApi}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-semibold">{lo.home.qualityGear}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {lo.home.qualityBody}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-semibold">{lo.home.simpleNav}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {lo.home.simpleNavBody}
              </p>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
