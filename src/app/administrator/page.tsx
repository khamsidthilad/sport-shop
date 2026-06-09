'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppSelector';
import { isStaffRole } from '@/types/user.type';

/** Entry route for /administrator — login UI lives in layout.tsx */
export default function AdministratorPage() {
  const admin = useAppSelector((s) => s.auth.admin);
  const router = useRouter();

  useEffect(() => {
    if (admin && isStaffRole(admin.role)) {
      router.replace('/administrator/dashboard');
    }
  }, [admin, router]);

  return null;
}
