import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'cart';

function persistCartItems(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color,
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      persistCartItems(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<CartItem & { quantity: number }>,
    ) => {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color,
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      persistCartItems(state.items);
    },
    removeFromCart: (
      state,
      action: PayloadAction<Pick<CartItem, 'productId' | 'size' | 'color'>>,
    ) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.size === action.payload.size &&
            i.color === action.payload.color
          ),
      );
      persistCartItems(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persistCartItems([]);
    },
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      persistCartItems(action.payload);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export const setItems = cartSlice.actions.setItems;

export default cartSlice.reducer;
