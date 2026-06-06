import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Supplier } from '@/types/supplier.type';

export interface SupplierState {
  items: Supplier[];
}

const initialState: SupplierState = {
  items: [],
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Supplier[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<Supplier>) => {
      state.items = [action.payload, ...state.items];
    },
  },
});

export const { setItems, addItem } = supplierSlice.actions;
export default supplierSlice.reducer;
