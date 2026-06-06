import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/user.type';

export interface UserState {
  items: User[];
}

const initialState: UserState = {
  items: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<User[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<User>) => {
      state.items = [action.payload, ...state.items];
    },
  },
});

export const { setItems, addItem } = userSlice.actions;
export default userSlice.reducer;
