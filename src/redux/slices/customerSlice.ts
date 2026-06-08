import { Customer } from '@/types/customer.type';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CustomerState {
  items: Customer[];
}

const initialState: CustomerState = {
  items: [],
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Customer[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = customerSlice.actions;
export default customerSlice.reducer;
