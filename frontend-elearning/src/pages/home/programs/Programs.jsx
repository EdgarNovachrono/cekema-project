/**
 * src/pages/home/programs/Programs.jsx
 * Section "formations populaires" de la page d'accueil.
 * Données chargées depuis GET /api/courses (backend Laravel).
 *
 * Affiche les 6 premières formations actives.
 * Les champs utilisés depuis CourseResource :
 *   id, title, category, thumbnail, duration_months, type, trainer
 * (price masqué pour les visiteurs non connectés)
 */

import React from 'react';
import { FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import ProgramsCard from '../../../component/programs/ProgramsCard';
import { useCourses } from '../../../hooks/useCourses';

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="w-full rounded-xl border border-neutral-200 overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/10] bg-neutral-200" />
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="h-6 w-24 bg-neutral-200 rounded-full" />
          <div className="h-6 w-16 bg-neutral-200 rounded-full" />
        </div>
        <div className="h-6 w-full bg-neutral-200 rounded" />
        <div className="h-4 w-3/4 bg-neutral-200 rounded" />
        <div className="h-px bg-neutral-200" />
        <div className="flex justify-between">
          <div className="h-5 w-20 bg-neutral-200 rounded" />
          <div className="h-8 w-28 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Mapping CourseResource → props de ProgramsCard ───────────────────────────

/**
 * Convertit un CourseResource (backend) en props attendues par ProgramsCard.
 * Adapte les champs pour correspondre exactement à l'interface existante.
 */
function mapCourseToCardProps(course) {
  return {
    // ProgramsCard attend : image, category, rating, title,
    //   lessons, students, duration, price
    image: course.thumbnail ?? 'https://cdn.pixabay.com/photo/2020/02/24/04/26/web-design-4875188_640.jpg',
    category: course.category ?? 'Formation',
    rating: '4.5',                                    // non fourni par l'API publique
    title: course.title,
    lessons: course.modules?.length
      ? `${course.modules.length} module${course.modules.length > 1 ? 's' : ''}`
      : 'Modules disponibles',
    students: 'Apprenants',                           // non fourni dans CourseResource
    duration: course.duration_months
      ? `${course.duration_months} mois`
      : 'Durée variable',
    price: course.price != null ? `${course.price} FCFA` : 'Gratuit',
    // On passe l'id pour le lien vers le détail
    id: course.id,
  };
}

// ─── Composant principal ──────────────────────────────────────────────────────

const Programs = () => {
  const { courses, loading, error } = useCourses();

  // On n'affiche que les 6 premières formations sur la home
  const displayedCourses = courses.slice(0, 6);

  return (
    <div className="w-full md:px-16 sm:px-10 px-4 space-y-8">
      {/* En-tête de section */}
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-800">
          Formations populaires
        </h2>
        <div className="flex items-center gap-4">
          <Link
            to="/programs"
            className="flex items-center gap-1 text-sm font-semibold text-neutral-800 hover:text-sky-800 cursor-pointer ease-in-out duration-300"
          >
            Voir tout <FaAngleRight />
          </Link>
        </div>
      </div>

      {/* Gestion des états */}
      {error && (
        <div className="w-full py-8 text-center">
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-neutral-400 text-xs mt-1">
            Vérifiez que le backend tourne sur le port 5715.
          </p>
        </div>
      )}

      {/* Grille de formations */}
      <div className="w-full grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : displayedCourses.length > 0
          ? displayedCourses.map((course) => (
              <ProgramsCard key={course.id} {...mapCourseToCardProps(course)} />
            ))
          : !error && (
              <div className="col-span-3 text-center text-neutral-400 py-12">
                Aucune formation disponible pour le moment.
              </div>
            )}
      </div>
    </div>
  );
};

export default Programs;