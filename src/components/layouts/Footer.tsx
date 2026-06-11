'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { lo } from '@/lib/lao';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="font-display text-2xl tracking-wider">
            {lo.brand.sport}<span className="text-accent-brand">{lo.brand.shop}</span>
          </div>
          <p className="mt-3 text-sm opacity-70 max-w-sm">{lo.footer.tagline}</p>
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
          <h4 className="font-display text-lg mb-3">{lo.footer.shop}</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/shop">{lo.footer.allProducts}</Link></li>
            <li><Link href="/category">{lo.nav.categories}</Link></li>
            <li><Link href="/brand">{lo.nav.brands}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">{lo.footer.company}</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/shop">{lo.footer.aboutUs}</Link></li>
            <li><Link href="/contact">{lo.nav.contact}</Link></li>
            <li><a href="#">{lo.footer.privacy}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs opacity-60">
        {lo.footer.copyright}
      </div>
    </footer>
  );
}
