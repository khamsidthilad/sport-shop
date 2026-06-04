import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CategoryState {
  items: Array<Record<string, unknown>>;
}

const initialState: CategoryState = {
  items: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CategoryState['items']>) => {
      state.items = action.payload;
    },
  },
});

export const { setItems } = categorySlice.actions;
export default categorySlice.reducer;
