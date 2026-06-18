import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { panierApi } from '../../service/api';

// ============================================================
// CORRECTIF #1 : intval défini EN PREMIER pour éviter le
// ReferenceError (const/let ne sont pas hoisted en JS)
// ============================================================
const intval = (val) => {
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? val : parsed;
};

// ============================================================
// Thunks
// ============================================================
export const fetchPanier = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await panierApi.get();
      return Array.isArray(data) ? data : data.items || [];
    } catch {
      return rejectWithValue([]);
    }
  }
);

export const ajouterAuPanier = createAsyncThunk(
  'cart/ajouter',
  async ({ produit_id, quantite = 1, produit }, { rejectWithValue }) => {
    try {
      await panierApi.ajouter(produit_id, quantite);

      const cleanPrice = Number(produit?.prix_unitaire || produit?.prix || 0);
      const cleanImage = produit?.image_principale || produit?.image || '/placeholder.jpg';

      return {
        id: intval(produit_id),   // intval() est maintenant défini avant son usage
        nom: produit?.nom || 'Produit Cekema',
        prix: cleanPrice,
        image: cleanImage,
        quantity: quantite,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur panier');
    }
  }
);

export const modifierQuantite = createAsyncThunk(
  'cart/modifier',
  async ({ produit_id, quantite }, { rejectWithValue }) => {
    try {
      await panierApi.modifier(produit_id, quantite);
      return { id: intval(produit_id), quantity: quantite };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur modification');
    }
  }
);

export const supprimerDuPanier = createAsyncThunk(
  'cart/supprimer',
  async (produit_id, { rejectWithValue }) => {
    try {
      await panierApi.supprimer(produit_id);
      return intval(produit_id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur suppression');
    }
  }
);

// ============================================================
// Slice
// ============================================================
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // Mode Invité : ajout local dans Redux
    addToCart: (state, action) => {
      const p = action.payload;
      if (!p) return;

      const targetId = intval(p.id);
      const existing = state.items.find((i) => intval(i.id) === targetId);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id: targetId,
          nom: p.nom || 'Produit Sans Nom',
          prix: Number(p.prix_unitaire || p.prix || 0),
          image: p.image_principale || p.image || '/placeholder.jpg',
          quantity: 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      const targetId = intval(action.payload);
      state.items = state.items.filter((i) => intval(i.id) !== targetId);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const targetId = intval(id);
      const item = state.items.find((i) => intval(i.id) === targetId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => intval(i.id) !== targetId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanier.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPanier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.map((item) => ({
          id: intval(item.produit_id || item.id),
          nom: item.nom || item.produit?.nom || 'Produit',
          prix: Number(item.prix_unitaire || item.prix || item.produit?.prix || 0),
          quantity: item.quantite || item.quantity || 1,
          image: item.image_principale || item.image || item.produit?.image_principale || '/placeholder.jpg',
        }));
      })
      .addCase(fetchPanier.rejected, (state) => {
        state.isLoading = false;
        state.items = [];
      });

    builder
      .addCase(ajouterAuPanier.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(ajouterAuPanier.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, nom, prix, image, quantity } = action.payload;
        const existing = state.items.find((i) => intval(i.id) === intval(id));
        if (existing) {
          existing.quantity += quantity;
        } else {
          state.items.push({ id, nom, prix, image, quantity });
        }
      })
      .addCase(ajouterAuPanier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(modifierQuantite.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const item = state.items.find((i) => intval(i.id) === intval(id));
        if (item) item.quantity = quantity;
      });

    builder
      .addCase(supprimerDuPanier.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => intval(i.id) !== intval(action.payload));
      });
  },
});
// ============================================================
// Sélecteurs (Ajoutés et sécurisés contre le NaN)
// ============================================================
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => {
    const currentPrice = Number(item.prix) || 0;
    const currentQty = Number(item.quantity) || 0;
    return sum + (currentPrice * currentQty);
  }, 0);

export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

// Export des actions synchrones (Mode Invité)
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;