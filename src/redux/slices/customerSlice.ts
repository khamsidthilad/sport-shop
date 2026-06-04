import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CustomerState {
  items: Array<Record<string, unknown>>;
}

const initialState: CustomerState = {
  items: [],
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CustomerState['items']>) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = customerSlice.actions;
export default customerSlice.reducer;
