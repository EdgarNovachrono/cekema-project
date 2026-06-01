/**
 * src/service/api.js
 * Couche HTTP centrale — CekemaSmart eLearning Frontend
 *
 * Backend accessible sur : http://host.docker.internal:5715 (depuis le conteneur)
 * ou http://localhost:5715 (depuis l'hôte)
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5715';

// ─── Token Storage ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'cekema_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildHeaders(extra = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...extra,
  };
  const token = tokenStorage.get();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(method, path, body = null, options = {}) {
  const url = `${BASE_URL}/api${path}`;
  const config = {
    method,
    headers: buildHeaders(options.headers ?? {}),
  };

  if (body) config.body = JSON.stringify(body);

  const response = await fetch(url, config);

  if (response.status === 401) {
    tokenStorage.remove();
  }

  let data;
  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const err = new Error(data?.message ?? 'Erreur réseau');
    err.status = response.status;
    err.errors = data?.errors ?? null;
    throw err;
  }

  return data;
}

const api = {
  get: (path, options) => request('GET', path, null, options),
  post: (path, body, options) => request('POST', path, body, options),
  put: (path, body, options) => request('PUT', path, body, options),
  delete: (path, options) => request('DELETE', path, null, options),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  resetPassword: (data) => api.post('/reset-password', data),
  twoFactorChallenge: (challenge_token, code) =>
    api.post('/two-factor/challenge', { challenge_token, code }),
};

// ─── Formations (Courses) ─────────────────────────────────────────────────────
// GET /api/courses → public (sans prix)
// GET /api/courses → avec token Bearer → avec prix (si authentifié)
// La réponse backend : { data: [ CourseResource, ... ] }
// CourseResource contient : id, title, description, category, type,
//   thumbnail, duration_months, is_active, trainer, modules, price, etc.

export const coursesApi = {
  /**
   * Liste toutes les formations actives du catalogue.
   * Endpoint: GET /api/courses
   * Réponse: { data: CourseResource[] }
   */
  list: () => api.get('/courses'),

  /**
   * Détail d'une formation.
   * Endpoint: GET /api/courses/:id
   * Réponse: { data: CourseResource }
   */
  show: (id) => api.get(`/courses/${id}`),
};

// ─── Inscriptions (Enrollments) ───────────────────────────────────────────────
// GET /api/enrollments/me → formations de l'apprenant connecté (requiert token)
// Réponse paginée : { data: EnrollmentResource[], meta: {...}, links: {...} }
// EnrollmentResource contient : id, formation{id,title,type,thumbnail,duration},
//   mode, status, payment_status, progress, start_date, end_date, certificate

export const enrollmentsApi = {
  /**
   * Formations auxquelles l'apprenant est inscrit.
   * Endpoint: GET /api/enrollments/me
   * Requiert: Bearer token
   */
  mine: () => api.get('/enrollments/me'),

  /**
   * Progression détaillée d'une inscription.
   * Endpoint: GET /api/enrollments/:id/progress
   */
  progress: (enrollmentId) => api.get(`/enrollments/${enrollmentId}/progress`),

  /**
   * S'inscrire à une formation.
   * Endpoint: POST /api/enrollments
   * Body: { formation_id, mode }
   */
  enroll: (formation_id, mode) => api.post('/enrollments', { formation_id, mode }),
};

// ─── Dashboard apprenant ──────────────────────────────────────────────────────
// GET /api/dashboard/apprenant → stats + inscriptions + recommandations
// Réponse: {
//   enrollments: [{course_id, course_name, progress, status}],
//   certificates: [...],
//   wallet_balance: number,
//   marketing: { message, recommendations: Course[] }
// }

export const dashboardApi = {
  /**
   * Dashboard apprenant.
   * Endpoint: GET /api/dashboard/apprenant
   * Requiert: Bearer token
   */
  get: () => api.get('/dashboard/apprenant'),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  list: () => api.get('/notifications'),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
  destroy: (id) => api.delete(`/notifications/${id}`),
};

export default api;