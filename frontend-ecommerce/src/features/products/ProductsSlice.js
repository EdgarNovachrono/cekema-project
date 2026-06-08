import Products from "../../contanst/produits";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: Products,
    filteredItems: Products,
    searchQuery: "",
    selectedCategory: "ALL",
};

const filterProducts = (state) => {
    return state.items.filter((item) => {
        const name = item.nom || item.name || "";

        const matchSearchQuery = name
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase());

        const matchCategory =
             state.selectedCategory === "ALL" ||
    item.categorie?.toLowerCase() === state.selectedCategory.toLowerCase();

        return matchSearchQuery && matchCategory;
    });
};

const ProductsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        filterBySearch: (state, action) => {
            state.searchQuery = action.payload;
            state.filteredItems = filterProducts(state);
        },

        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
            state.filteredItems = filterProducts(state);
        },
    },
});

export const { filterBySearch, setSelectedCategory } = ProductsSlice.actions;
export default ProductsSlice.reducer;