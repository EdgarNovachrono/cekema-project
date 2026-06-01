/**
 * src/component/recommendations/RecommendationCard.jsx
 * Carte de recommandation — adapte le style de ProgramsCard
 * aux champs retournés par l'API FastAPI de recommandation.
 *
 * Props (CourseReco de l'API) :
 *   course_id, title, category, level, price_fcfa,
 *   rating, thumbnail, reco_score, strategy
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaStar, FaRobot, FaAnglesRight } from 'react-icons/fa6';

// Fallback image si thumbnail absent
const FALLBACK_IMG =
  'https://cdn.pixabay.com/photo/2020/02/24/04/26/web-design-4875188_640.jpg';

// Badge selon la stratégie de recommandation
const StrategyBadge = ({ strategy }) => {
  if (strategy === 'knn_svd') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-purple-700
        bg-purple-100 rounded-full px-2 py-0.5">
        <FaRobot size={10} /> Personnalisé
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-sky-700
      bg-sky-100 rounded-full px-2 py-0.5">
      🔥 Populaire
    </span>
  );
};

const RecommendationCard = ({
  course_id,
  title,
  category,
  level,
  price_fcfa,
  rating,
  thumbnail,
  reco_score,
  strategy,
}) => {
  const displayPrice =
    price_fcfa != null && price_fcfa > 0
      ? `${Number(price_fcfa).toLocaleString('fr-FR')} FCFA`
      : 'Gratuit';

  return (
    <div className="w-full rounded-xl border border-neutral-200
      hover:border-sky-200 hover:shadow-md space-y-2 overflow-hidden
      transition-all duration-300 bg-white group">

      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <img
          src={thumbnail || FALLBACK_IMG}
          alt={title}
          className="w-full h-full object-cover object-center
            group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        {/* Badge stratégie */}
        <div className="absolute top-3 left-3">
          <StrategyBadge strategy={strategy} />
        </div>
      </div>

      <div className="md:p-4 p-3 space-y-4">
        {/* Catégorie + Note */}
        <div className="w-full flex items-center justify-between">
          <p className="w-fit text-sm text-sky-800 bg-sky-800/10
            rounded-full px-3 py-1 flex items-center gap-x-1.5">
            <FaTag size={12} className="text-sky-700" />
            {category ?? 'Formation'}
          </p>
          {rating != null && (
            <p className="text-sm text-yellow-500 rounded-full px-3 py-1
              flex items-center gap-x-1 border border-yellow-100">
              <FaStar size={12} />
              {Number(rating).toFixed(1)}
            </p>
          )}
        </div>

        {/* Titre */}
        <Link
          to={`/programs/${course_id}`}
          className="block text-base font-semibold text-neutral-900
            line-clamp-2 hover:text-sky-700 transition-colors duration-200"
        >
          {title}
        </Link>

        {/* Niveau + prix */}
        <div className="w-full flex items-center justify-between flex-wrap gap-2">
          {level && (
            <span className="text-xs text-neutral-500 bg-neutral-100
              rounded-full px-2 py-1">
              {level}
            </span>
          )}
          <p className="text-base font-semibold text-neutral-800 ml-auto">
            {displayPrice}
          </p>
        </div>

        {/* Séparateur */}
        <div className="w-full h-px bg-neutral-100" />

        {/* CTA */}
        <Link
          to={`/programs/${course_id}`}
          className="w-full flex items-center justify-between
            text-sm text-sky-700 font-medium hover:text-sky-900
            transition-colors duration-200"
        >
          Voir la formation
          <FaAnglesRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default RecommendationCard;