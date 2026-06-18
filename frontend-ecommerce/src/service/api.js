import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const SR_BASE_URL  = import.meta.env.VITE_SR_URL  || 'http://localhost:8000';

// ============================================================
// CORRECTIF #5 : URL MinIO centralisée ici.
// Tous les composants importent getImageUrl() depuis ce fichier
// pour ne jamais dupliquer la logique de résolution d'image.
// ============================================================
export const MINIO_BASE_URL =
  import.meta.env.VITE_MINIO_URL || 'http://localhost:9000/cekema-products/';

/**
 * Résout l'URL finale d'une image produit.
 *
 * Règles (dans l'ordre) :
 *  1. Null/undefined → image placeholder
 *  2. URL complète (http/https) → utilisée telle quelle
 *  3. Nom de fichier brut → préfixé avec MINIO_BASE_URL
 *
 * À utiliser partout : ProductCard, RecommendationSection,
 * RecommendationPopup, ProductDetail.
 */
export const getImageUrl = (rawImage) => {
  if (!rawImage || rawImage === 'null' || rawImage === 'undefined') {
    return '/placeholder.jpg';
  }
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
    return rawImage;
  }
  return `${MINIO_BASE_URL}${rawImage}`;
};

/**
 * Normalise un tableau de produits venant de FastAPI :
 * - Résout les images
 * - Uniformise les clés (image_principale, prix_unitaire)
 */
export const normaliserProduitsSR = (productsArray) => {
  if (!Array.isArray(productsArray)) return [];
  return productsArray.map((p) => ({
    ...p,
    image_principale: getImageUrl(p.image_principale || p.image),
    prix_unitaire: Number(p.prix_unitaire || p.prix || 0),
  }));
};

// ============================================================
// Instance Axios — backend PHP
// ============================================================
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Instance Axios — système de recommandation FastAPI
export const srApi = axios.create({
  baseURL: SR_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Gestion du token JWT
export const tokenStorage = {
  get:    () => localStorage.getItem('cekema_token'),
  set:    (token) => localStorage.setItem('cekema_token', token),
  remove: () => localStorage.removeItem('cekema_token'),
};

// Injection automatique du token
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gestion erreur 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute = err.config?.url?.includes('auth/');
    if (err.response?.status === 401 && !isAuthRoute) {
      tokenStorage.remove();
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  login:    async (email, password) => (await api.post('/api/auth/login.php', { email, password })).data,
  register: async (formData)        => (await api.post('/api/auth/register.php', formData)).data,
  me:       async ()                => (await api.get('/api/auth/me.php')).data,
  logout:   async ()                => (await api.post('/api/auth/logout.php')).data,
};

// ============================================================
// Produits API
// ============================================================
export const produitsApi = {
  getAll:       async (params = {}) => (await api.get('/api/produits/liste.php', { params })).data,
  getById:      async (id)          => (await api.get(`/api/produits/detail.php?id=${id}`)).data,
  getCategories: async ()           => (await api.get('/api/produits/categories.php')).data,
};

// ============================================================
// Panier API
// ============================================================
export const panierApi = {
  get:       async ()                       => (await api.get('/api/panier/get.php')).data,
  ajouter:   async (produit_id, quantite=1) => (await api.post('/api/panier/ajouter.php', { produit_id, quantite })).data,
  modifier:  async (produit_id, quantite)   => (await api.post('/api/panier/modifier.php', { produit_id, quantite })).data,
  supprimer: async (produit_id)             => (await api.post('/api/panier/supprimer.php', { produit_id })).data,
  vider:     async ()                       => (await api.post('/api/panier/vider.php')).data,
};

export const trackingApi = {
  vue: async (produit_id) => {
    try { await api.post('/api/produits/vue.php', { produit_id }); } catch { /* silencieux */ }
  },
};

export const commandeApi = {
  creer: async (orderData) => (await api.post('/api/commandes/creer.php', orderData)).data,
};

// ============================================================
// Système de Recommandation — FastAPI Python
// CORRECTIF #5 : normaliserProduitsSR() appliqué sur les retours
// pour uniformiser image_principale partout.
// ============================================================
export const recommendationApi = {
  getSimilaires: async (produit_id, pays = null, n = 8) => {
    try {
      const res = await srApi.get('/recommend/content', { params: { produit_id, pays, n } });
      return { recommendations: normaliserProduitsSR(res.data.recommendations) };
    } catch {
      return { recommendations: [] };
    }
  },

  getPourUtilisateur: async (user_id, pays = null, n = 8) => {
    try {
      const res = await srApi.get('/recommend/collaborative', { params: { user_id, pays, n } });
      return { recommendations: normaliserProduitsSR(res.data.recommendations) };
    } catch {
      return { recommendations: [] };
    }
  },

  getColdStart: async (pays = null, categorie = null, n = 8) => {
    try {
      const res = await srApi.get('/recommend/popular', { params: { pays, categorie, n } });
      return { recommendations: normaliserProduitsSR(res.data.recommendations) };
    } catch {
      return { recommendations: [] };
    }
  },
};

export default api;