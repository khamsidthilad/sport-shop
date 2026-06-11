'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useCartCount } from '@/hooks/useCartCount';
import { useCustomerSession } from '@/hooks/useCustomerSession';
import { lo } from '@/lib/lao';

const nav = [
  { href: '/', label: lo.nav.home },
  { href: '/shop', label: lo.nav.shop },
  { href: '/category', label: lo.nav.categories },
  { href: '/brand', label: lo.nav.brands },
  { href: '/contact', label: lo.nav.contact },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();
  const session = useCustomerSession();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-2xl tracking-wider">
            {lo.brand.sport}<span className="text-accent-brand">{lo.brand.shop}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((n) => (
              <Link
                key={n.href + n.label}
                href={n.href}
                className={`text-sm font-medium uppercase tracking-wide hover:text-accent-brand transition-colors ${
                  pathname === n.href ? 'text-accent-brand' : ''
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/shop" aria-label={lo.common.search} className="p-2 hover:text-accent-brand">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 hover:text-accent-brand">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-brand text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {session ? (
              <Link href="/profile" className="p-2 hover:text-accent-brand">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-semibold uppercase border border-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {lo.nav.login}
              </Link>
            )}
            <button
              type="button"
              className="lg:hidden p-2"
              onClick={() => setOpen(!open)}
              aria-label={lo.nav.menu}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden pb-4 flex flex-col gap-3 border-t border-border pt-4">
            {nav.map((n) => (
              <Link
                key={n.href + n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-wide"
              >
                {n.label}
              </Link>
            ))}
            {!session && (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium uppercase">
                  {lo.nav.login}
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="text-sm font-medium uppercase">
                  {lo.nav.register}
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
