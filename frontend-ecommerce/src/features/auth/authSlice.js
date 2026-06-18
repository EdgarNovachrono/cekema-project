import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, tokenStorage } from '../../service/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(email, password);
      if (data.access_token) tokenStorage.set(data.access_token);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Email ou mot de passe incorrect'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await authApi.register(formData);
      if (data.access_token) tokenStorage.set(data.access_token);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Erreur lors de l'inscription"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.me();
      return data.user;
    } catch {
      tokenStorage.remove();
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authApi.logout(); } catch {}
  finally { tokenStorage.remove(); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    isAuthenticated: !!tokenStorage.get(),
    isInitialized: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false; state.user = action.payload;
        state.isAuthenticated = true; state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload; state.isAuthenticated = false;
      });

    builder
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false; state.user = action.payload;
        state.isAuthenticated = true; state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload; state.isAuthenticated = false;
      });

    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false; state.user = action.payload;
        state.isAuthenticated = true; state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false; state.user = null;
        state.isAuthenticated = false; state.isInitialized = true;
      });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null; state.isAuthenticated = false; state.isInitialized = true;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;