/**
 * src/hooks/useDashboard.js
 * Hook pour le dashboard apprenant.
 *
 * Endpoint : GET /api/dashboard/apprenant (requiert Bearer token)
 *
 * Réponse backend :
 * {
 *   enrollments: [{ course_id, course_name, progress, status }],
 *   certificates: [...],
 *   wallet_balance: number,
 *   marketing: {
 *     message: string,
 *     recommendations: Course[]
 *   }
 * }
 */

import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../service/api';

/**
 * Récupère les données du dashboard de l'apprenant connecté.
 *
 * Retourne :
 *   dashboard  : { enrollments, certificates, wallet_balance, marketing } | null
 *   loading    : boolean
 *   error      : string | null
 *   refetch    : () => void
 */
export function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem('cekema_token');
    if (!token) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.get();
      setDashboard(data);
    } catch (err) {
      setError(err.message ?? 'Impossible de charger le dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
}