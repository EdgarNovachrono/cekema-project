/**
 * src/hooks/useCourses.js
 * Hooks pour récupérer les formations depuis le backend CekemaSmart.
 *
 * Endpoints utilisés :
 *   GET /api/courses          → liste publique (sans prix si non connecté)
 *   GET /api/courses/:id      → détail d'une formation
 *   GET /api/enrollments/me   → formations de l'apprenant connecté
 *
 * Réponse backend (CourseResource) :
 *   { id, title, description, category, type, thumbnail,
 *     duration_months, is_active, trainer, modules,
 *     price, base_price, hybrid_price (null si non connecté) }
 */

import { useState, useEffect, useCallback } from 'react';
import { coursesApi, enrollmentsApi } from '../service/api';

// ─── Liste globale des formations ─────────────────────────────────────────────

/**
 * Récupère toutes les formations actives du catalogue.
 * Utilisable sans authentification (les prix sont masqués).
 *
 * Retourne :
 *   courses  : CourseResource[]
 *   loading  : boolean
 *   error    : string | null
 *   refetch  : () => void
 */
export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await coursesApi.list();
      // Le backend retourne { data: [...] } (Laravel Resource Collection)
      setCourses(Array.isArray(response) ? response : response.data ?? []);
    } catch (err) {
      setError(err.message ?? 'Impossible de charger les formations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}

// ─── Détail d'une formation ───────────────────────────────────────────────────

/**
 * Récupère une formation par son ID.
 *
 * Retourne :
 *   course   : CourseResource | null
 *   loading  : boolean
 *   error    : string | null
 */
export function useCourse(id) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    coursesApi
      .show(id)
      .then((response) => setCourse(response.data ?? response))
      .catch((err) => setError(err.message ?? 'Erreur lors du chargement.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { course, loading, error };
}

// ─── Formations de l'apprenant connecté ──────────────────────────────────────

/**
 * Récupère les inscriptions (formations rejointes) de l'apprenant connecté.
 * Requiert un token valide dans localStorage ('cekema_token').
 *
 * Réponse backend (EnrollmentResource) :
 *   { id, formation{id,title,type,thumbnail,duration},
 *     mode, status, payment_status, progress, certificate }
 *
 * Retourne :
 *   enrollments : EnrollmentResource[]
 *   loading     : boolean
 *   error       : string | null
 *   refetch     : () => void
 */
export function useMyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    // Pas de token → apprenant non connecté, on retourne vide proprement
    const token = localStorage.getItem('cekema_token');
    if (!token) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await enrollmentsApi.mine();
      // Réponse paginée : { data: [...], meta, links }
      setEnrollments(Array.isArray(response) ? response : response.data ?? []);
    } catch (err) {
      setError(err.message ?? 'Impossible de charger vos formations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return { enrollments, loading, error, refetch: fetchEnrollments };
}