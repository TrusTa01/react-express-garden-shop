import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import notificationsReducer from './slices/notificationsSlice';

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    notifications: notificationsReducer,
  },
});

export default store;
