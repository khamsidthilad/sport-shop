'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useCustomerSession } from '@/hooks/useCustomerSession';
import { loginCustomer, clearError } from '@/redux/slices/authSlice';
import type { LoginCredentials } from '@/types/auth.type';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';

const loginSchema = z.object({
  username: z.string().trim().min(2, 'Required').max(50),
  password: z.string().min(4, 'Required').max(100),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const error = useAppSelector((s) => s.auth.error);
  const loading = useAppSelector((s) => s.auth.loading);
  const session = useCustomerSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (session) router.push('/profile');
  }, [session, router]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await dispatch(loginCustomer(data)).unwrap();
      toast.success('Welcome back!');
    } catch (message) {
      toast.error(typeof message === 'string' ? message : 'Login failed');
    }
  };

  return (
    <CustomerLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-center font-display text-4xl">LOGIN</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest">Username</label>
            <input
              {...register('username')}
              autoComplete="username"
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest">Password</label>
            <input
              type="password"
              {...register('password')}
              autoComplete="current-password"
              className="mt-1 w-full border border-border bg-background px-3 py-2"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary py-3 font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          No account?{' '}
          <Link href="/register" className="font-semibold text-accent-brand">
            Register
          </Link>
        </p>
      </div>
    </CustomerLayout>
  );
}
