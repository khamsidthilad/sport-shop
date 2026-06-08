import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '@/types/category.type';

export interface CategoryState {
  items: Category[];
}

const initialState: CategoryState = {
  items: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<Category>) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setItems, addItem } = categorySlice.actions;
export default categorySlice.reducer;
