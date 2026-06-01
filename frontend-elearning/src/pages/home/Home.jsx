/**
 * src/pages/home/Home.jsx
 * Page d'accueil — avec section recommandations IA intégrée.
 */

import { useEffect } from 'react';
import Apprenant from './aprenant/Apprenant';
import Stats from '../stats/Stats';
import Category from '../category/Category';
import Programs from './programs/Programs';
import RecommendationsSection from '../../component/recommendations/RecommendationsSection';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-16 w-full min-h-screen flex flex-col pb-16">

      {/* 1. Hero */}
      <Apprenant />

      {/* 2. Stats */}
      <div className="!-mt-16">
        <Stats />
      </div>

      {/* 3. Catégories */}
      <Category />

      {/* 4. Catalogue formations (depuis Laravel /api/courses) */}
      <Programs />

      {/* 5. Recommandations IA
          - Visiteur non connecté → formations populaires (cold-start)
          - Utilisateur connecté  → KNN+SVD personnalisé
          - Si l'API IA est hors ligne → section masquée silencieusement */}
      <RecommendationsSection n={6} />

    </div>
  );
};

export default Home;