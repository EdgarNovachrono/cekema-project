import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recommendationApi } from '../../service/api';

// ============================================================
// Thunks
// ============================================================

export const fetchRecommandationsUtilisateur = createAsyncThunk(
  'recommendations/forUser',
  async ({ user_id, pays }, { rejectWithValue }) => {
    try {
      const data = await recommendationApi.getPourUtilisateur(user_id, pays, 8);
      return data.recommendations || [];
    } catch {
      return rejectWithValue([]);
    }
  }
);

export const fetchProduitsSimilaires = createAsyncThunk(
  'recommendations/similar',
  async ({ produit_id, pays }, { rejectWithValue }) => {
    try {
      const data = await recommendationApi.getSimilaires(produit_id, pays, 8);
      return data.recommendations || [];
    } catch {
      return rejectWithValue([]);
    }
  }
);

export const fetchPopulaires = createAsyncThunk(
  'recommendations/popular',
  async ({ pays, categorie }, { rejectWithValue }) => {
    try {
      const data = await recommendationApi.getColdStart(pays, categorie, 8);
      return data.recommendations || [];
    } catch {
      return rejectWithValue([]);
    }
  }
);

// ============================================================
// Slice
// ============================================================

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState: {
    pourUtilisateur: [],   // KNN+SVD — utilisateur connecté
    similaires: [],         // Filtrage contenu — produits similaires
    populaires: [],         // Cold start — top par pays
    isLoading: false,
    source: null,           // 'collaborative' | 'content' | 'popular'
  },
  reducers: {
    clearRecommendations: (state) => {
      state.pourUtilisateur = [];
      state.similaires = [];
      state.populaires = [];
    },
  },
  extraReducers: (builder) => {
    // Pour l'utilisateur (collaboratif)
    builder
      .addCase(fetchRecommandationsUtilisateur.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecommandationsUtilisateur.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pourUtilisateur = action.payload;
        state.source = 'collaborative';
      })
      .addCase(fetchRecommandationsUtilisateur.rejected, (state) => {
        state.isLoading = false;
      });

    // Similaires (contenu)
    builder
      .addCase(fetchProduitsSimilaires.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProduitsSimilaires.fulfilled, (state, action) => {
        state.isLoading = false;
        state.similaires = action.payload;
        state.source = 'content';
      })
      .addCase(fetchProduitsSimilaires.rejected, (state) => {
        state.isLoading = false;
      });

    // Populaires (cold start)
    builder
      .addCase(fetchPopulaires.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPopulaires.fulfilled, (state, action) => {
        state.isLoading = false;
        state.populaires = action.payload;
        state.source = 'popular';
      })
      .addCase(fetchPopulaires.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;