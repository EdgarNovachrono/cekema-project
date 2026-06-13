import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/ProductsSlice';
import cartReducer from '..//features/Cart/CartSlice';
import recommendationsReducer from '../features/recommendations/recommendationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    recommendations: recommendationsReducer,
  },
});

export default store;