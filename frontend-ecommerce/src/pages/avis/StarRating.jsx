import  { useState } from 'react';
import { Star } from 'lucide-react';

// ============================================================
// StarRating — affichage statique ou interactif
// Props :
//   note        : number  — note actuelle (0-5)
//   onChange    : func    — si fourni, rend le composant interactif
//   size        : number  — taille des étoiles (défaut 20)
//   showLabel   : bool    — affiche le texte de la note
// ============================================================

const LABELS = {
  1: 'Très mauvais',
  2: 'Mauvais',
  3: 'Correct',
  4: 'Bon',
  5: 'Excellent',
};

const StarRating = ({
  note = 0,
  onChange = null,
  size = 20,
  showLabel = false,
  className = '',
}) => {
  const [hovered, setHovered] = useState(0);
  const isInteractif = typeof onChange === 'function';
  const displayed = isInteractif ? (hovered || note) : note;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayed;
        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractif}
            onClick={() => isInteractif && onChange(star)}
            onMouseEnter={() => isInteractif && setHovered(star)}
            onMouseLeave={() => isInteractif && setHovered(0)}
            className={`transition-transform ${
              isInteractif
                ? 'cursor-pointer hover:scale-110'
                : 'cursor-default'
            }`}
            aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={
                filled
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-200 fill-gray-200'
              }
            />
          </button>
        );
      })}

      {showLabel && displayed > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {LABELS[Math.round(displayed)]}
        </span>
      )}
    </div>
  );
};

export default StarRating;