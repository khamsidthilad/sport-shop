'use client';

import { useSyncExternalStore } from 'react';
import { store } from '@/redux/store';
import type { CartItem } from '@/redux/slices/cartSlice';

function subscribe(onStoreChange: () => void) {
  return store.subscribe(onStoreChange);
}

function getCartItems(): CartItem[] {
  return store.getState().cart.items;
}

function getCartCount(): number {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

/** Cart items from Redux; hydration snapshot is always [] before localStorage rehydration. */
export function useCartItems(): CartItem[] {
  return useSyncExternalStore(subscribe, getCartItems, () => []);
}

/** Cart count from Redux; hydration snapshot is always 0 to match SSR before localStorage rehydration. */
export function useCartCount(): number {
  return useSyncExternalStore(subscribe, getCartCount, () => 0);
}

/** False during SSR/hydration, true after client mount — avoids hydration mismatches. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
