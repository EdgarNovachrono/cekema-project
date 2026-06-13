import axios from 'axios';

// Base URL du backend PHP dur
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// Base URL du système de recommandation FastAPI Python
const SR_BASE_URL = import.meta.env.VITE_SR_URL || 'http://localhost:8000';

// ============================================================
// Instance Axios pour le backend PHP
// ============================================================
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Cookies de session PHP
  headers: { 'Content-Type': 'application/json' },
});

// Instance Axios pour le système de recommandation
export const srApi = axios.create({
  baseURL: SR_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Gestion du token JWT
export const tokenStorage = {
  get: () => localStorage.getItem('cekema_token'),
  set: (token) => localStorage.setItem('cekema_token', token),
  remove: () => localStorage.removeItem('cekema_token'),
};

// Injection automatique du token sur chaque requête PHP
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gestion des erreurs 401 — redirection vers login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      tokenStorage.remove();
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

// ============================================================
// Auth API — cohérent avec les routes PHP /auth/*.php
// ============================================================
export const authApi = {
  login: async (email, password) => {
    const res = await api.post('api/auth/login.php', { email, password });
    return res.data; // { success, access_token, user }
  },
  register: async (formData) => {
    const res = await api.post('/auth/register.php', formData);
    return res.data;
  },
  me: async () => {
    const res = await api.get('/auth/me.php');
    return res.data; // { user }
  },
  logout: async () => {
    const res = await api.post('/auth/logout.php');
    return res.data;
  },
};

// ============================================================
// Produits API — cohérent avec les routes PHP
// ============================================================
export const produitsApi = {
  getAll: async (params = {}) => {
    const res = await api.get('api/produits/liste.php', { params });
    return res.data; // { produits: [...] }
  },
  getById: async (id) => {
    const res = await api.get(`api/produits/detail.php?id=${id}`);
    return res.data; // { produit: {...} }
  },
  getCategories: async () => {
    const res = await api.get('api/produits/categories.php');
    return res.data; // { categories: [...] }
  },
};

// ============================================================
// Panier API — cohérent avec les routes PHP
// ============================================================
export const panierApi = {
  ajouter: async (produit_id, quantite = 1) => {
    const res = await api.post('/panier/ajouter.php', { produit_id, quantite });
    return res.data;
  },
  get: async () => {
    const res = await api.get('/panier/get.php');
    return res.data;
  },
  supprimer: async (produit_id) => {
    const res = await api.post('/panier/supprimer.php', { produit_id });
    return res.data;
  },
};

// ============================================================
// Commandes API
// ============================================================
export const commandeApi = {
  creer: async (orderData) => {
    const res = await api.post('/commandes/creer.php', orderData);
    return res.data;
  },
};

// ============================================================
// Système de Recommandation API — FastAPI Python
// ============================================================
export const recommendationApi = {
  // Filtrage par contenu — produits similaires à un produit
  getSimilaires: async (produit_id, pays = null, n = 8) => {
    try {
      const res = await srApi.get('api/recommend/content', {
        params: { produit_id, pays, n },
      });
      return res.data; // { recommendations: [...] }
    } catch {
      return { recommendations: [] };
    }
  },

  // Filtrage collaboratif KNN+SVD — pour un utilisateur connecté
  getPourUtilisateur: async (user_id, pays = null, n = 8) => {
    try {
      const res = await srApi.get('api/recommend/collaborative', {
        params: { user_id, pays, n },
      });
      return res.data; // { recommendations: [...] }
    } catch {
      return { recommendations: [] };
    }
  },

  // Cold start — top produits par pays/catégorie
  getColdStart: async (pays = null, categorie = null, n = 8) => {
    try {
      const res = await srApi.get('api/recommend/popular', {
        params: { pays, categorie, n },
      });
      return res.data;
    } catch {
      return { recommendations: [] };
    }
  },
};

export default api;