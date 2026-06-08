import {configureStore} from "@reduxjs/toolkit";
import productsReducer from "../features/products/ProductsSlice";
const store = configureStore({
    reducer:{
        products:productsReducer,
    }
});
export default store;