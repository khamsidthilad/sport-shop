import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Brand } from '@/types/brand.type';

export interface BrandState {
  items: Brand[];
}

const initialState: BrandState = {
  items: [],
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Brand[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<Brand>) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setItems, addItem } = brandSlice.actions;
export default brandSlice.reducer;
