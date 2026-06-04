'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';

export default function HomePage() {
  return (
    <CustomerLayout>
      <section className="relative min-h-[85vh] overflow-hidden bg-primary text-primary-foreground">
        <Image
          src="/assets/hero-athlete.jpg"
          alt="Athlete sprinting"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/80 to-primary/20" />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="inline-flex w-fit rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-accent-brand backdrop-blur-sm">
            New Season · 2026
          </p>
          <h1 className="font-display mt-6 max-w-4xl text-balance text-6xl leading-[0.9] md:text-8xl lg:text-9xl">
            JUST DO
            <br />
            <span className="text-accent-brand">MORE.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
            Performance gear engineered for athletes who refuse to settle. Train harder, run faster,
            play stronger.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-sm bg-accent-brand px-8 py-4 text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-bold transition hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-sm border-2 border-primary-foreground/80 px-8 py-4 text-sm font-bold uppercase tracking-wider transition hover:bg-primary-foreground hover:text-primary"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-brand">Fast delivery</p>
            <h2 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
              Shop with confidence.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              No distractions, no live data dependencies. Browse our collection and discover premium
              athletic essentials with a clean, static experience.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-semibold">Quality gear</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Curated performance products built for everyday training and competition.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <h3 className="font-semibold">Simple navigation</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Explore categories, brands, and checkout routes without fetching any external data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}


