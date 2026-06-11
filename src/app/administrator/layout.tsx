'use client';
import { useRouter, usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { loginAdmin, logoutAdmin } from '@/redux/slices/authSlice';
import { Sidebar } from '@/components/layouts/Sidebar';
import { isStaffRole } from '@/types/user.type';
import { lo } from '@/lib/lao';

const schema = z.object({
  username: z.string().trim().min(2).max(50),
  password: z.string().min(2).max(100),
});
type FormData = z.infer<typeof schema>;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = useAppSelector((s) => s.auth.admin);
  const error = useAppSelector((s) => s.auth.error);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isAuthorized = !!admin && isStaffRole(admin.role);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (mounted && admin && !isStaffRole(admin.role)) {
      dispatch(logoutAdmin());
    }
  }, [admin, mounted, dispatch]);

  useEffect(() => {
    if (mounted && isAuthorized && pathname === '/administrator') {
      router.push('/administrator/dashboard');
    }
  }, [isAuthorized, mounted, router, pathname]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = (data: FormData) => dispatch(loginAdmin(data));

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <p className="text-sm uppercase tracking-widest text-primary-foreground/60">{lo.common.loading}</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl text-center">{lo.adminNav.adminPanel}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="text-xs uppercase font-bold tracking-widest">{lo.common.username}</label>
              <input {...register('username')} className="w-full mt-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground" />
              {errors.username && <p className="text-xs text-accent-brand mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="text-xs uppercase font-bold tracking-widest">{lo.common.password}</label>
              <input type="password" {...register('password')} className="w-full mt-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground" />
              {errors.password && <p className="text-xs text-accent-brand mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-accent-brand">{error}</p>}
            <button type="submit" className="w-full bg-accent-brand text-accent-foreground py-3 font-bold uppercase tracking-wider hover:opacity-90">{lo.adminNav.signIn}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <Sidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
