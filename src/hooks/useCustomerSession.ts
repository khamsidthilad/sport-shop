'use client';

import { useSyncExternalStore } from 'react';
import { store } from '@/redux/store';
import type { CustomerAuthData } from '@/types/auth.type';

function subscribe(onStoreChange: () => void) {
  return store.subscribe(onStoreChange);
}

function getCustomerSession(): CustomerAuthData | null {
  return store.getState().auth.customerSession;
}

/** Session from Redux; server/hydration snapshot is always null to avoid mismatch with localStorage rehydration. */
export function useCustomerSession(): CustomerAuthData | null {
  return useSyncExternalStore(
    subscribe,
    getCustomerSession,
    () => null,
  );
}
