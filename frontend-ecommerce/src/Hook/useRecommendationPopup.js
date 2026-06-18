import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRecommandationsUtilisateur,
  fetchPopulaires,
} from '../features/recommendations/recommendationsSlice';

const POPUP_DELAY = 4000;
const POPUP_DURATION = 15000;
const COOLDOWN = 5 * 60 * 1000; 
const SESSION_KEY = 'cekema_popup_last_shown';

export const useRecommendationPopup = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth || { user: null, isAuthenticated: false });
  const { pourUtilisateur, populaires, isLoading } = useSelector(
    (state) => state.recommendations
  );

  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(POPUP_DURATION / 1000);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const delayRef = useRef(null);

  const pourUtilisateurLength = pourUtilisateur?.length || 0;
  const populairesLength = populaires?.length || 0;

  const produits = isAuthenticated && pourUtilisateurLength > 0
    ? pourUtilisateur.slice(0, 4)
    : populaires.slice(0, 4);

  const mode = isAuthenticated && pourUtilisateurLength > 0 ? 'collaborative' : 'popular';

  const label = mode === 'collaborative'
    ? 'Des personnes ont aimé ces produits'
    : 'Les plus populaires en ce moment';

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setTimeLeft(POPUP_DURATION / 1000);
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  }, []);

  const startTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);

    timerRef.current = setTimeout(() => {
      dismiss();
    }, POPUP_DURATION);

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [dismiss]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    clearInterval(countdownRef.current); // Cleared preventively to avoid timer acceleration
    clearTimeout(timerRef.current);

    const remaining = timeLeft * 1000;

    timerRef.current = setTimeout(() => {
      dismiss();
    }, remaining);

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timeLeft, dismiss]);

  // Sync Data dependencies
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchRecommandationsUtilisateur({ user_id: user.id, pays: user.pays || null }));
    } else {
      dispatch(fetchPopulaires({ pays: null, categorie: null }));
    }
  }, [isAuthenticated, user?.id, user?.pays, dispatch]);

  // Core trigger lifecycle logic
  useEffect(() => {
    const lastShown = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
    if (Date.now() - lastShown < COOLDOWN) return;
    if (isLoading || produits.length === 0) return;

    clearTimeout(delayRef.current);
    delayRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeLeft(POPUP_DURATION / 1000);
      startTimer();
    }, POPUP_DELAY);

    return () => clearTimeout(delayRef.current);
  }, [isLoading, produits.length, startTimer]);

  useEffect(() => {
    return () => {
      clearTimeout(delayRef.current);
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  return {
    isVisible,
    produits,
    mode,
    label,
    timeLeft,
    isPaused,
    isLoading,
    dismiss,
    handleMouseEnter,
    handleMouseLeave,
    POPUP_DURATION,
  };
};