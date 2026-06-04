import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  customerName: string;
  total: number;
  status: string;
}

export interface OrderState {
  items: OrderItem[];
}

const initialState: OrderState = {
  items: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<OrderItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = orderSlice.actions;
export default orderSlice.reducer;
