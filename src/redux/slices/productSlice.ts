import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ProductState {
  items: Array<Record<string, unknown>>;
}

const initialState: ProductState = {
  items: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ProductState['items']>) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = productSlice.actions;
export default productSlice.reducer;
