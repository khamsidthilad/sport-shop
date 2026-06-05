import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product.type';

export interface ProductState {
  items: Product[];
}

const initialState: ProductState = {
  items: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = productSlice.actions;
export default productSlice.reducer;
