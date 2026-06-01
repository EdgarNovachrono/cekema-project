/**
 * src/hooks/useRecommendations.js
 * Envoie automatiquement le token Bearer de l'utilisateur connecté
 * pour que l'API FastAPI puisse récupérer son profil réel depuis Laravel.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const RECO_API = import.meta.env.VITE_RECO_API_URL ?? 'http://localhost:8000';
const TOKEN_KEY = 'cekema_token';

export function useRecommendations(n = 8) {
  const { isAuthenticated } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [strategy, setStrategy]               = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Construire les headers — on envoie le token si l'utilisateur est connecté
      const headers = { Accept: 'application/json' };
      const token   = localStorage.getItem(TOKEN_KEY);

      if (token) {
        // L'API FastAPI utilisera ce token pour appeler GET /api/me sur Laravel
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${RECO_API}/recommend/smart?n=${n}`,
        { method: 'GET', headers, signal: AbortSignal.timeout(8000) },
      );

      if (!res.ok) throw new Error(`API erreur ${res.status}`);

      const data = await res.json();
      setRecommendations(data.courses ?? []);
      setStrategy(data.strategy ?? 'popular');

    } catch (err) {
      // L'API IA n'est pas critique — on masque silencieusement
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, n]);

  useEffect(() => {
    load();
  }, [load]);

  return { recommendations, strategy, loading, error, refetch: load };
}