import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { produitsApi } from '../../service/api';

// ============================================================
// Thunks
// ============================================================

export const fetchProduits = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await produitsApi.getAll(params);
      return data.produits || [];
    } catch (err) {
      return rejectWithValue('Erreur chargement produits');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await produitsApi.getCategories();
      return data.categories || [];
    } catch {
      return rejectWithValue('Erreur chargement catégories');
    }
  }
);

// ============================================================
// Slice
// ============================================================

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filteredItems: [],
    categories: ['ALL'],
    searchQuery: '',
    selectedCategory: 'ALL',
    isLoading: false,
    error: null,
  },
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
  extraReducers: (builder) => {
  builder
    .addCase(fetchProduits.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchProduits.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
      state.filteredItems = action.payload;
    })
    .addCase(fetchProduits.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {  // ← un seul
      state.categories = ['ALL', ...action.payload.map(c => c.nom)];
    });
},
});

// Fonction de filtre locale
function filterProducts(state) {
  return state.items.filter((item) => {
    const nom = (item.nom || item.name || '').toLowerCase();
    const matchSearch = nom.includes(state.searchQuery.toLowerCase());
    const matchCat =
      state.selectedCategory === 'ALL' ||
      (item.categorie || '').toLowerCase() ===
        state.selectedCategory.toLowerCase();
    return matchSearch && matchCat;
  });
}

export const { filterBySearch, setSelectedCategory } = productsSlice.actions;
export default productsSlice.reducer;