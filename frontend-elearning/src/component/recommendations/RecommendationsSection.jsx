/**
 * src/component/recommendations/RecommendationsSection.jsx
 * Section de recommandations IA — utilisable sur Home et Dashboard.
 *
 * Props :
 *   title   (string)  — Titre de la section (optionnel)
 *   n       (number)  — Nombre de formations à afficher (défaut 6)
 *   compact (boolean) — Mode compact pour le dashboard (grille 2 colonnes)
 *
 * Comportement :
 *   - Utilisateur connecté  → recommandations KNN+SVD personnalisées
 *   - Visiteur / nouveau    → formations populaires (cold-start)
 *   - Erreur API            → section masquée silencieusement
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRecommendations } from '../../hooks/useRecommendations';
import RecommendationCard from './RecommendationCard';
import { FaRobot } from 'react-icons/fa6';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="w-full rounded-xl border border-neutral-200 overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/10] bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-20 bg-neutral-200 rounded-full" />
          <div className="h-5 w-12 bg-neutral-200 rounded-full" />
        </div>
        <div className="h-5 w-full bg-neutral-200 rounded" />
        <div className="h-4 w-2/3 bg-neutral-200 rounded" />
        <div className="h-px bg-neutral-200" />
        <div className="h-4 w-1/2 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}

// ─── Badge stratégie (titre dynamique) ───────────────────────────────────────

function SectionTitle({ strategy, isAuthenticated, customTitle }) {
  if (customTitle) return (
    <h2 className="text-2xl font-bold text-neutral-800">{customTitle}</h2>
  );

  if (strategy === 'knn_svd' && isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-neutral-800">
          Recommandé pour vous
        </h2>
        <span className="flex items-center gap-1.5 text-xs font-semibold
          text-purple-700 bg-purple-100 rounded-full px-3 py-1">
          <FaRobot size={11} /> IA personnalisée
        </span>
      </div>
    );
  }

  return (
    <h2 className="text-2xl font-bold text-neutral-800">
      Formations populaires
    </h2>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

const RecommendationsSection = ({
  title,
  n = 6,
  compact = false,
}) => {
  const { isAuthenticated } = useAuth();
  const { recommendations, strategy, loading, error } = useRecommendations(n);

  // Si erreur API → on masque silencieusement (l'API IA n'est pas critique)
  if (error && !loading) return null;

  // Si aucun résultat après chargement → on masque
  if (!loading && recommendations.length === 0) return null;

  const gridClass = compact
    ? 'grid md:grid-cols-2 grid-cols-1 md:gap-6 gap-4'
    : 'grid md:grid-cols-3 grid-cols-1 md:gap-8 gap-5';

  return (
    <div className="w-full md:px-16 sm:px-10 px-4 space-y-8">
      {/* En-tête */}
      <div className="w-full flex items-center justify-between flex-wrap gap-3">
        <SectionTitle
          strategy={strategy}
          isAuthenticated={isAuthenticated}
          customTitle={title}
        />

        {/* Sous-titre contextuel */}
        <p className="text-sm text-neutral-400">
          {strategy === 'knn_svd'
            ? 'Basées sur votre historique d\'apprentissage'
            : 'Les formations les mieux évaluées par la communauté'}
        </p>
      </div>

      {/* Grille */}
      <div className={gridClass}>
        {loading
          ? Array.from({ length: n }).map((_, i) => <SkeletonCard key={i} />)
          : recommendations.map((course) => (
              <RecommendationCard key={course.course_id} {...course} />
            ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;