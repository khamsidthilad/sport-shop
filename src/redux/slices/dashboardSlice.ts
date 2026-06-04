import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface MonthlySalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface CategorySalesData {
  name: string;
  sales: number;
}

export interface DashboardState {
  monthlySales: MonthlySalesData[];
  categorySales: CategorySalesData[];
}

const initialState: DashboardState = {
  monthlySales: [],
  categorySales: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMonthlySales: (state, action: PayloadAction<MonthlySalesData[]>) => {
      state.monthlySales = action.payload;
    },
    setCategorySales: (state, action: PayloadAction<CategorySalesData[]>) => {
      state.categorySales = action.payload;
    },
  },
});

export const { setMonthlySales, setCategorySales } = dashboardSlice.actions;
export default dashboardSlice.reducer;
