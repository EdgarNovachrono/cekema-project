import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProduits,
  fetchCategories,
  setSelectedCategory,
} from '../features/products/ProductsSlice';
import {
  fetchRecommandationsUtilisateur,
  fetchPopulaires,
} from '../features/recommendations/recommendationsSlice';
import ProductGrid from '../Components/ProductGrid';
import RecommendationSection from '../Components/RecommendationSection';
import Footer from '../Components/Footer';

const Home = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { categories, selectedCategory, isLoading, error } = useSelector(
    (state) => state.products
  );
  const {
    pourUtilisateur,
    populaires,
    isLoading: recoLoading,
    source,
  } = useSelector((state) => state.recommendations);

  // Chargement initial
  useEffect(() => {
    dispatch(fetchProduits());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Recommandations selon état auth
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Utilisateur connecté → filtrage collaboratif KNN+SVD
      dispatch(
        fetchRecommandationsUtilisateur({
          user_id: user.id,
          pays: user.pays || null,
        })
      );
    } else {
      // Cold start → top produits populaires
      dispatch(fetchPopulaires({ pays: null, categorie: null }));
    }
  }, [isAuthenticated, user, dispatch]);

  const recosPrincipales = isAuthenticated ? pourUtilisateur : populaires;
  const recoSource = isAuthenticated ? 'collaborative' : 'popular';
  const recoTitre = isAuthenticated
    ? `Recommandé pour vous, ${user?.prenom || ''}`
    : 'Produits populaires';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière */}
      <div className="w-full h-[40vh] md:h-[55vh] bg-gradient-to-r from-[#008294] to-[#006b7a] flex items-center justify-center overflow-hidden relative">
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Cekema Online Market
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            La marketplace africaine pensée pour vous
          </p>
        </div>
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Section recommandations principale */}
        <RecommendationSection
          title={recoTitre}
          produits={recosPrincipales}
          source={recoSource}
          isLoading={recoLoading}
        />

        {/* Séparateur */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-500 font-medium">
            Tous les produits
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Filtres catégories */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#008294] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#008294] hover:text-[#008294]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille produits */}
        {error ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Impossible de charger les produits</p>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => dispatch(fetchProduits())}
              className="mt-4 px-6 py-2 bg-[#008294] text-white rounded-lg hover:bg-[#006b7a] transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <ProductGrid />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;