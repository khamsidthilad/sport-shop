'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { registerCustomer, logoutCustomer } from '@/redux/slices/authSlice';
import type { RegisterInput } from '@/types/auth.type';
import { CustomerLayout } from '@/components/layouts/CustomerLayout';
import { lo } from '@/lib/lao';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),
  sname: z.string().trim().min(2).max(50),
  dateOfBirth: z.string().min(8),
  username: z.string().trim().min(2).max(50),
  password: z.string().min(6).max(100),
  tel: z.string().trim().min(8).max(20),
  address: z.string().trim().min(5).max(255),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const FieldR = ({
  label,
  error,
  ...rest
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    <input {...rest} className="mt-1 w-full border border-border bg-background px-3 py-2" />
    {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
  </label>
);

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const error = useAppSelector((s) => s.auth.error);
  const loading = useAppSelector((s) => s.auth.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const payload: RegisterInput = {
      name: data.name,
      sname: data.sname,
      dateOfBirth: data.dateOfBirth,
      username: data.username,
      password: data.password,
      tel: data.tel,
      address: data.address,
    };
    try {
      await dispatch(registerCustomer(payload)).unwrap();
      dispatch(logoutCustomer());
      toast.success(lo.auth.accountCreated);
      router.push('/login');
    } catch (message) {
      toast.error(typeof message === 'string' ? message : lo.auth.registerFailed);
    }
  };
  return (
    <CustomerLayout>
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-center font-display text-4xl">{lo.auth.createAccount}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-2 gap-4">
          <FieldR label={lo.auth.fullName} error={errors.name?.message} {...register('name')} />
          <FieldR label={lo.auth.surname} error={errors.sname?.message} {...register('sname')} />
          <FieldR
            label={lo.auth.dateOfBirth}
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
          <FieldR label={lo.auth.telephone} error={errors.tel?.message} {...register('tel')} />
          <FieldR label={lo.common.username} error={errors.username?.message} {...register('username')} />
          <FieldR
            label={lo.common.password}
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="col-span-2">
            <FieldR label={lo.common.address} error={errors.address?.message} {...register('address')} />
          </div>
          {error && <p className="col-span-2 text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-primary py-3 font-bold uppercase tracking-wider text-primary-foreground hover:bg-accent-brand disabled:opacity-60"
          >
            {loading ? lo.auth.creatingAccount : lo.nav.register}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          {lo.auth.haveAccount}{' '}
          <Link href="/login" className="font-semibold text-accent-brand">
            {lo.auth.login}
          </Link>
        </p>
      </div>
    </CustomerLayout>
  );
}
