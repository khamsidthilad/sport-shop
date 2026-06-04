'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="font-display text-2xl tracking-wider">
            SPORT<span className="text-accent-brand">SHOP</span>
          </div>
          <p className="mt-3 text-sm opacity-70 max-w-sm">
            Performance gear for athletes who refuse to quit. Authentic products, fast shipping.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Facebook" className="p-2 border border-primary-foreground/30 hover:bg-accent-brand hover:border-accent-brand">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Instagram" className="p-2 border border-primary-foreground/30 hover:bg-accent-brand hover:border-accent-brand">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Twitter" className="p-2 border border-primary-foreground/30 hover:bg-accent-brand hover:border-accent-brand">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="YouTube" className="p-2 border border-primary-foreground/30 hover:bg-accent-brand hover:border-accent-brand">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Shop</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/shop">Categories</Link></li>
            <li><Link href="/shop">Brands</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Company</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/shop">About Us</Link></li>
            <li><Link href="/shop">Contact</Link></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs opacity-60">
        © 2026 SportShop. All rights reserved.
      </div>
    </footer>
  );
}
