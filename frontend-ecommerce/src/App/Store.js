import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/ProductsSlice";
import cartReducer from "../features/Cart/CartSlice"; 

const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer,
    }
});

export default store;