import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { produitsApi } from '../../service/api';

// ============================================================
// Thunks
// ============================================================

export const fetchProduits = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await produitsApi.getAll(params);
      return {
        produits: data.produits || [],
        pagination: data.pagination || null,
      };
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
    items: [],                // produits de la PAGE COURANTE seulement
    // Tableau d'objets { id: number|null, nom: string }
    // id=null pour "ALL" — on envoie l'id entier au backend (categorie_id)
    categories: [{ id: null, nom: 'ALL' }],
    selectedCategoryId: null,    // null = toutes catégories
    selectedCategoryNom: 'ALL',  // pour l'affichage des boutons
    searchQuery: '',
    pagination: {
      current_page: 1,
      limit: 12,
      total_items: 0,
      has_more: false,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    // Remplace filterBySearch — met à jour la query et remet la page à 1
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.current_page = 1;
    },
    // Reçoit { id, nom } — stocke l'id pour l'API et le nom pour l'affichage
    setSelectedCategory: (state, action) => {
      const { id, nom } = action.payload;
      state.selectedCategoryId = id;       // null si "ALL"
      state.selectedCategoryNom = nom;
      state.pagination.current_page = 1;
    },
    // Navigation entre pages
    setPage: (state, action) => {
      state.pagination.current_page = action.payload;
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
        state.items = action.payload.produits;
        // On fusionne pour ne pas perdre limit si le backend ne le renvoie pas
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(fetchProduits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // On conserve { id, nom } pour pouvoir envoyer l'id entier au backend
        state.categories = [
          { id: null, nom: 'ALL' },
          ...action.payload.map((c) => ({ id: c.id, nom: c.nom })),
        ];
      });
  },
});

export const { setSearchQuery, setSelectedCategory, setPage } = productsSlice.actions;

// Sélecteur pratique pour l'affichage des boutons catégorie
export const selectCategories = (state) => state.products.categories;
export const selectSelectedCategoryNom = (state) => state.products.selectedCategoryNom;

// Sélecteurs
export const selectPagination = (state) => state.products.pagination;
export const selectTotalPages = (state) => {
  const { total_items, limit } = state.products.pagination;
  return Math.ceil(total_items / limit) || 1;
};

export default productsSlice.reducer;