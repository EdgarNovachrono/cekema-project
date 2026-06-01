/**
 * src/hooks/useEnrollments.js
 *
 * FIX : accepte un paramètre `enabled` (booléen).
 * Le fetch ne se déclenche QUE quand enabled===true.
 * Ça élimine la race condition ET le 401 pour les visiteurs.
 *
 * Usage :
 *   const { isAuthenticated } = useAuth();
 *   const { enrollments } = useEnrollments(isAuthenticated);
 */

import { useState, useEffect, useCallback } from 'react';
import { enrollmentsApi } from '../service/api'; // adapte le chemin à ton projet

export function useEnrollments(enabled = false) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enrollmentsApi.mine();
      setEnrollments(data.data ?? data);
    } catch (err) {
      if (err.status === 401) {
        setEnrollments([]);
      } else {
        setError(err.message ?? 'Impossible de charger vos inscriptions.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Non connecté : on remet à zéro proprement
      setEnrollments([]);
      setLoading(false);
      setError(null);
      return;
    }
    fetchEnrollments();
  }, [enabled, fetchEnrollments]); // se re-déclenche quand enabled passe de false → true

  return { enrollments, loading, error, refetch: fetchEnrollments };
}