import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import brandReducer from './slices/brandSlice';
import customerReducer from './slices/customerSlice';
import orderReducer from './slices/orderSlice';
import supplierReducer from './slices/supplierSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    category: categoryReducer,
    brand: brandReducer,
    customer: customerReducer,
    order: orderReducer,
    supplier: supplierReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
