/**
 * src/component/notifications/LoginNotificationModal.jsx
 *
 * Modal qui s'affiche au centre de l'écran à chaque connexion.
 * Contient :
 *   - Une formation recommandée personnalisée
 *   - Un ebook lié à la même catégorie
 *
 * Comportement :
 *   - Apparaît automatiquement après login (déclenché par AuthContext)
 *   - Une seule fois par session (géré via sessionStorage)
 *   - Clic formation → navigate vers /programs/:id
 *   - Clic ebook     → navigate vers /ebooks/:id
 *   - Se ferme avec ✕ ou clic hors du modal
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaBook, FaXmark, FaArrowRight } from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa';

const RECO_API  = import.meta.env.VITE_RECO_API_URL ?? 'http://localhost:8000';
const TOKEN_KEY = 'cekema_token';
const SESSION_KEY = 'cekema_notif_shown'; // clé sessionStorage

// ─── Fallback image ───────────────────────────────────────────────────────────
const FALLBACK = 'https://cdn.pixabay.com/photo/2020/02/24/04/26/web-design-4875188_640.jpg';

// ─── Skeleton interne ─────────────────────────────────────────────────────────
function ModalSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-5 w-1/3 bg-neutral-200 rounded" />
      <div className="h-36 w-full bg-neutral-200 rounded-xl" />
      <div className="h-4 w-2/3 bg-neutral-200 rounded" />
      <div className="h-4 w-1/2 bg-neutral-200 rounded" />
      <div className="h-px bg-neutral-200" />
      <div className="h-16 w-full bg-neutral-200 rounded-xl" />
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
const LoginNotificationModal = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const [visible,      setVisible]      = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [course,       setCourse]       = useState(null);
  const [ebook,        setEbook]        = useState(null);
  const [hasNotif,     setHasNotif]     = useState(false);

  // ── Charger la notification depuis l'API ─────────────────────────────────
  const fetchNotification = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${RECO_API}/recommend/notification`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) return;

      const data = await res.json();
      if (data.has_notification) {
        setCourse(data.course  ?? null);
        setEbook(data.ebook   ?? null);
        setHasNotif(true);
        setVisible(true);
        // Marquer comme déjà montré pour cette session
        sessionStorage.setItem(SESSION_KEY, '1');
      }
    } catch {
      // Silencieux — les notifications ne sont pas critiques
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Déclencher à chaque connexion ────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      // Réinitialiser pour la prochaine connexion
      sessionStorage.removeItem(SESSION_KEY);
      setVisible(false);
      setCourse(null);
      setEbook(null);
      return;
    }

    // Déjà montré dans cette session → ne pas respammer
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Délai de 1.5s après connexion pour laisser la page se charger
    const timer = setTimeout(fetchNotification, 1500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, fetchNotification]);

  // ── Fermeture ─────────────────────────────────────────────────────────────
  const close = () => setVisible(false);

  const goToCourse = () => {
    if (course?.course_id) {
      navigate(`/programs/${course.course_id}`);
      close();
    }
  };

  const goToEbook = () => {
    if (ebook?.id) {
      navigate(`/ebooks/${ebook.id}`);
      close();
    }
  };

  if (!visible) return null;

  return (
    // ── Overlay ──────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 backdrop-blur-sm p-4"
      onClick={close}
    >
      {/* ── Carte modale ── */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl
          overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} // évite fermeture au clic intérieur
      >

        {/* ── Bouton fermer ── */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full
            bg-neutral-100 hover:bg-neutral-200 text-neutral-500
            transition-colors duration-200"
          aria-label="Fermer"
        >
          <FaXmark size={14} />
        </button>

        {/* ── Skeleton pendant le chargement ── */}
        {loading && <ModalSkeleton />}

        {/* ── Contenu ── */}
        {!loading && hasNotif && (
          <div className="space-y-0">

            {/* ── En-tête ── */}
            <div className="px-6 pt-6 pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <FaRobot size={14} className="text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Recommandé pour vous
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                Basé sur votre parcours d'apprentissage
              </p>
            </div>

            {/* ── Formation recommandée ── */}
            {course && (
              <button
                onClick={goToCourse}
                className="w-full text-left group"
              >
                <div className="mx-6 mb-4 rounded-xl overflow-hidden border
                  border-neutral-200 hover:border-sky-300 hover:shadow-md
                  transition-all duration-300">

                  {/* Image */}
                  <div className="relative w-full h-36 overflow-hidden">
                    <img
                      src={course.thumbnail || FALLBACK}
                      alt={course.title}
                      className="w-full h-full object-cover
                        group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = FALLBACK; }}
                    />
                    {/* Badge catégorie */}
                    <div className="absolute top-2 left-2">
                      <span className="text-xs font-medium bg-white/90 text-sky-700
                        px-2 py-1 rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="p-3 space-y-1.5">
                    <p className="font-semibold text-neutral-900 text-sm line-clamp-2
                      group-hover:text-sky-700 transition-colors">
                      {course.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {course.rating && (
                          <>
                            <FaStar size={11} className="text-yellow-400" />
                            <span className="text-xs text-neutral-500">
                              {Number(course.rating).toFixed(1)}
                            </span>
                          </>
                        )}
                        {course.level && (
                          <span className="text-xs text-neutral-400 ml-2">
                            · {course.level}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-neutral-800">
                        {course.price_fcfa
                          ? `${Number(course.price_fcfa).toLocaleString('fr-FR')} FCFA`
                          : 'Gratuit'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA formation */}
                <div className="mx-6 mb-4 flex items-center justify-between
                  text-sky-600 text-sm font-medium group-hover:text-sky-800">
                  <span>Voir cette formation</span>
                  <FaArrowRight size={13} />
                </div>
              </button>
            )}

            {/* ── Séparateur ebook ── */}
            {ebook && (
              <>
                <div className="mx-6 border-t border-neutral-100 mb-4" />

                {/* Ebook */}
                <button
                  onClick={goToEbook}
                  className="mx-6 mb-6 w-[calc(100%-3rem)] text-left group
                    flex items-center gap-3 rounded-xl border border-amber-200
                    bg-amber-50 hover:bg-amber-100 hover:border-amber-300
                    p-3 transition-all duration-200"
                >
                  {/* Icône ebook */}
                  <div className="w-10 h-10 rounded-lg bg-amber-200 flex items-center
                    justify-center flex-shrink-0">
                    {ebook.cover_image
                      ? <img src={ebook.cover_image} alt={ebook.title}
                          className="w-full h-full object-cover rounded-lg" />
                      : <FaBook size={18} className="text-amber-700" />
                    }
                  </div>

                  {/* Infos ebook */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-amber-700 mb-0.5">
                      📖 Ebook recommandé
                    </p>
                    <p className="text-sm font-medium text-neutral-800 line-clamp-1
                      group-hover:text-amber-800">
                      {ebook.title}
                    </p>
                    {ebook.author && (
                      <p className="text-xs text-neutral-500">{ebook.author}</p>
                    )}
                  </div>

                  {/* Prix + flèche */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-sm font-bold text-amber-800">
                      {ebook.price
                        ? `${Number(ebook.price).toLocaleString('fr-FR')} FCFA`
                        : 'Gratuit'}
                    </span>
                    <FaArrowRight size={11} className="text-amber-600" />
                  </div>
                </button>
              </>
            )}

            {/* ── Lien "ignorer" ── */}
            <div className="px-6 pb-5 text-center">
              <button
                onClick={close}
                className="text-xs text-neutral-400 hover:text-neutral-600
                  transition-colors underline underline-offset-2"
              >
                Ignorer pour cette session
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default LoginNotificationModal;