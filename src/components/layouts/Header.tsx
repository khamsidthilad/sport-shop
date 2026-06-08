'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useCartCount } from '@/hooks/useCartCount';
import { useCustomerSession } from '@/hooks/useCustomerSession';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/category', label: 'Categories' },
  { href: '/brand', label: 'Brands' },
  { href: '/contact', label: 'Contact' },
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
            SPORT<span className="text-accent-brand">SHOP</span>
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
            <Link href="/shop" aria-label="Search" className="p-2 hover:text-accent-brand">
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
                Login
              </Link>
            )}
            <button
              type="button"
              className="lg:hidden p-2"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
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
                  Login
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="text-sm font-medium uppercase">
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
