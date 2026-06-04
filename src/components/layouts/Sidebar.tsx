'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Users,
  UserCog,
  ShoppingBag,
  Truck,
  LogOut,
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { logoutAdmin } from '@/redux/slices/authSlice';

const items = [
  { href: '/administrator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/administrator/product', label: 'Products', icon: Package },
  { href: '/administrator/category', label: 'Categories', icon: FolderTree },
  { href: '/administrator/brand', label: 'Brands', icon: Tag },
  { href: '/administrator/customer', label: 'Customers', icon: Users },
  { href: '/administrator/user', label: 'Users', icon: UserCog },
  { href: '/administrator/order', label: 'Orders', icon: ShoppingBag },
  { href: '/administrator/import', label: 'Imports', icon: Truck },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.auth.admin);

  return (
    <aside className="w-64 bg-primary text-primary-foreground flex flex-col min-h-screen sticky top-0">
      <div className="p-6 border-b border-primary-foreground/10">
        <Link href="/" className="font-display text-xl tracking-wider">
          SPORT<span className="text-accent-brand">SHOP</span>
        </Link>
        <p className="text-xs mt-1 opacity-60">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors ${
                active ? 'bg-accent-brand text-accent-foreground' : 'hover:bg-primary-foreground/10'
              }`}
            >
              <Icon className="w-4 h-4" /> {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-primary-foreground/10">
        <div className="text-xs opacity-70 mb-2 px-3">
          {admin?.fullName} · {admin?.role}
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch(logoutAdmin());
            router.push('/administrator');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-accent-brand transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
