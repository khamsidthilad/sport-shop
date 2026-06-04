'use client';

import { useCustomerSession } from '@/hooks/useCustomerSession';

export function useAuth() {
  const session = useCustomerSession();
  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
  };
}
