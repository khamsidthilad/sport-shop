'use client';

import { useSyncExternalStore } from 'react';
import { store } from '@/redux/store';

function subscribe(onStoreChange: () => void) {
  return store.subscribe(onStoreChange);
}

function getCartCount(): number {
  return store.getState().cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Cart count from Redux; hydration snapshot is always 0 to match SSR before localStorage rehydration. */
export function useCartCount(): number {
  return useSyncExternalStore(subscribe, getCartCount, () => 0);
}
