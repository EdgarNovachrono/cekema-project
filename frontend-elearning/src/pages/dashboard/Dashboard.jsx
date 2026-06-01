/**
 * src/pages/dashboard/Dashboard.jsx
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnrollments } from '../../hooks/useEnrollments';
import RecommendationsSection from '../../component/recommendations/RecommendationsSection';
import { FiBookOpen, FiAward, FiTrendingUp, FiLogOut } from 'react-icons/fi';
import { FaCircleCheck } from 'react-icons/fa6';

// ─── Carte formation ──────────────────────────────────────────────────────────

const EnrollmentCard = ({ enrollment }) => {
  const { formation, status, progress, mode, certificate } = enrollment;

  const statusColors = {
    active:          'bg-green-100 text-green-700',
    pending_payment: 'bg-yellow-100 text-yellow-700',
    completed:       'bg-sky-100 text-sky-700',
    suspended:       'bg-red-100 text-red-700',
  };
  const statusLabel = {
    active:          'En cours',
    pending_payment: 'Paiement en attente',
    completed:       'Terminée',
    suspended:       'Suspendue',
  };

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white hover:border-sky-200 hover:shadow-sm transition-all duration-300 p-5 space-y-4">
      <div className="flex items-start gap-4">
        {formation?.thumbnail && (
          <img src={formation.thumbnail} alt={formation.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-semibold text-neutral-900 line-clamp-2 text-sm">
            {formation?.title ?? 'Formation'}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${statusColors[status] ?? 'bg-neutral-100 text-neutral-600'}`}>
              {statusLabel[status] ?? status}
            </span>
            {mode && <span className="text-xs text-neutral-400 capitalize">{mode}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Progression</span>
          <span className="font-semibold text-neutral-700">{progress ?? 0}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-700"
            style={{ width: `${progress ?? 0}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {formation?.duration && (
          <span className="text-xs text-neutral-400">{formation.duration}</span>
        )}
        {certificate?.available && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <FaCircleCheck size={12} /> Certificat disponible
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonEnrollment = () => (
  <div className="w-full rounded-xl border border-neutral-200 p-5 space-y-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-neutral-200 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-1/3" />
      </div>
    </div>
    <div className="h-2 bg-neutral-200 rounded-full" />
    <div className="flex justify-between">
      <div className="h-3 bg-neutral-200 rounded w-20" />
      <div className="h-3 bg-neutral-200 rounded w-24" />
    </div>
  </div>
);

// ─── Dashboard principal ──────────────────────────────────────────────────────

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { enrollments, loading: enrollLoading, error: enrollError } = useEnrollments(isAuthenticated);

  const inProgress = enrollments.filter(e => e.status === 'active');
  const completed  = enrollments.filter(e => e.status === 'completed');
  const firstName  = user?.first_name ?? user?.name?.split(' ')[0] ?? 'Apprenant';

  const handleLogout = async () => {
    await logout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="w-full min-h-screen pt-[10ch] pb-16 space-y-12 md:px-16 sm:px-10 px-4 bg-neutral-50">

      {/* ── En-tête + bouton déconnexion ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-neutral-400">Tableau de bord</p>
          <h1 className="text-3xl font-bold text-neutral-900">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-neutral-500 text-sm">
            Continuez votre parcours d'apprentissage
          </p>
        </div>

        {/* ✅ Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200
            bg-white text-neutral-600 text-sm font-medium
            hover:bg-red-50 hover:border-red-200 hover:text-red-600
            transition-all duration-200 shrink-0"
        >
          <FiLogOut size={15} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      {/* ── Statistiques rapides ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: FiBookOpen,   label: 'Formations suivies', value: enrollments.length, color: 'text-sky-600',    bg: 'bg-sky-50 border-sky-200'       },
          { icon: FiTrendingUp, label: 'En cours',           value: inProgress.length,  color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
          { icon: FiAward,      label: 'Terminées',          value: completed.length,   color: 'text-green-600',  bg: 'bg-green-50 border-green-200'   },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`rounded-xl border p-4 space-y-2 ${bg}`}>
            <Icon className={`${color} w-5 h-5`} />
            <p className={`text-2xl font-bold ${color}`}>{enrollLoading ? '…' : value}</p>
            <p className="text-xs text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Mes formations ── */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800">Mes formations</h2>
          <Link to="/programs" className="text-sm text-sky-600 hover:text-sky-800 font-medium">
            Découvrir plus →
          </Link>
        </div>

        {enrollError && <p className="text-sm text-red-400">{enrollError}</p>}

        {!enrollError && (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            {enrollLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonEnrollment key={i} />)
              : enrollments.length > 0
              ? enrollments.map(e => <EnrollmentCard key={e.id} enrollment={e} />)
              : (
                <div className="col-span-2 text-center py-12 space-y-2">
                  <p className="text-neutral-500">Vous n'êtes inscrit à aucune formation.</p>
                  <Link to="/programs" className="text-sky-600 text-sm font-medium hover:underline">
                    Parcourir le catalogue →
                  </Link>
                </div>
              )}
          </div>
        )}
      </div>

      {/* ── Recommandations IA ── */}
      <div className="space-y-2 -mx-4 sm:-mx-10 md:-mx-16 px-4 sm:px-10 md:px-16 py-10 bg-white border-t border-neutral-100">
        <RecommendationsSection
          title="Formations recommandées pour vous"
          n={4}
          compact={true}
        />
      </div>

    </div>
  );
};

export default Dashboard;