/**
 * src/pages/programs/Progrmas.jsx
 * Fix : MyEnrollments reçoit isAuthenticated et le passe à useEnrollments(enabled)
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';
import PageTopBanner from '../../component/pagetop/PageTop';
import ProgramsCard  from '../../component/programs/ProgramsCard';
import { useCourses }     from '../../hooks/useCourses';
import { useEnrollments } from '../../hooks/useEnrollments';
import { useAuth }        from '../../context/AuthContext';

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
      </div>
    </div>
  );
}

function mapCourseToCardProps(course, isEnrolled = false, progress = null) {
  return {
    image:     course.thumbnail ?? 'https://cdn.pixabay.com/photo/2020/02/24/04/26/web-design-4875188_640.jpg',
    category:  course.category  ?? 'Formation',
    rating:    '4.5',
    title:     course.title,
    lessons:   course.modules?.length
                 ? course.modules.length + ' module' + (course.modules.length > 1 ? 's' : '')
                 : 'Modules disponibles',
    students:  'Apprenants',
    duration:  course.duration_months ? course.duration_months + ' mois' : 'Durée variable',
    price:     course.price != null ? Number(course.price).toLocaleString() + ' FCFA' : 'Gratuit',
    id:        course.id,
    isEnrolled,
    progress,
  };
}

// ✅ Reçoit isAuthenticated en prop → le passe à useEnrollments(enabled)
function MyEnrollments({ isAuthenticated }) {
  const { enrollments, loading, error } = useEnrollments(isAuthenticated);

  if (loading) return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-800 border-b pb-3 border-neutral-200">
        Mes formations suivies
      </h2>
      <div className="grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-5">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  if (error || enrollments.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-800 border-b pb-3 border-neutral-200">
        Mes formations suivies
        <span className="ml-2 text-base font-normal text-neutral-400">({enrollments.length})</span>
      </h2>
      <div className="grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-5">
        {enrollments.map((enroll) => {
          const course = enroll.formation ?? enroll;
          return (
            <ProgramsCard
              key={'enrolled-' + enroll.id}
              {...mapCourseToCardProps(course, true, enroll.progress)}
            />
          );
        })}
      </div>
    </div>
  );
}

const Progrmas = () => {
  const { isAuthenticated } = useAuth();
  const { courses, loading, error, refetch } = useCourses();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(
    () => [...new Set(courses.map((c) => c.category).filter(Boolean))],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch = search.trim() === '' ||
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || course.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [courses, search, selectedCategory]);

  return (
    <div className="w-full min-h-screen flex-col space-y-16 pb-16">
      <PageTopBanner pageTitle="Nos Formations" />

      <div className="space-y-12 w-full md:px-16 sm:px-10 px-4">

        {/* Recherche + filtres */}
        <div className="w-full flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm w-full rounded-lg px-4 h-12 bg-transparent border border-neutral-300 focus:border-sky-500 outline-none text-neutral-700 ease-in-out duration-300"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-fit rounded-lg px-3 h-12 bg-white border border-neutral-300 focus:border-sky-500 outline-none text-neutral-700 cursor-pointer"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ✅ isAuthenticated passé en prop : MyEnrollments contrôle lui-même quand fetcher */}
        {isAuthenticated && <MyEnrollments isAuthenticated={isAuthenticated} />}

        {/* Catalogue général */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3 border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-800">
              {isAuthenticated ? "Découvrir d'autres formations" : 'Notre Catalogue'}
            </h2>
            <Link to="/programs" className="flex items-center gap-1 text-sm font-semibold text-neutral-800 hover:text-sky-800 transition">
              Voir tout <FaAngleRight />
            </Link>
          </div>

          {error && (
            <div className="text-center py-6 space-y-2">
              <p className="text-red-500 font-medium">{error}</p>
              <button onClick={refetch} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition">
                Réessayer
              </button>
            </div>
          )}

          <div className="w-full grid md:grid-cols-3 grid-cols-1 md:gap-x-10 md:gap-y-10 gap-y-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filteredCourses.length > 0
              ? filteredCourses.map((course) => (
                  <ProgramsCard key={course.id} {...mapCourseToCardProps(course)} />
                ))
              : !error && (
                  <div className="col-span-3 text-center py-12 text-neutral-400">
                    Aucune formation disponible pour le moment.
                  </div>
                )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Progrmas;