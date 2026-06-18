import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProduits,
  fetchCategories,
  setSelectedCategory,
  selectCategories,
  selectSelectedCategoryNom,
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
  const {
    searchQuery,
    selectedCategoryId,
    pagination,
    isLoading,
    error,
  } = useSelector((state) => state.products);
  const categories = useSelector(selectCategories);
  const selectedCategoryNom = useSelector(selectSelectedCategoryNom);

  const {
    pourUtilisateur,
    populaires,
    isLoading: recoLoading,
  } = useSelector((state) => state.recommendations);

  // Chargement des catégories une seule fois
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Re-fetch produits dès que la page, la recherche ou la catégorie change.
  // La recherche est déjà débouncée côté Navbar (350 ms), donc ce useEffect
  // ne se déclenche qu'après la pause de frappe — pas besoin d'un second délai.
  useEffect(() => {
    const params = {
      page: pagination.current_page,
      limit: pagination.limit,
    };
    if (searchQuery) params.search = searchQuery;
    // On envoie l'id entier — le backend filtre par categorie_id
    if (selectedCategoryId !== null) params.categorie = selectedCategoryId;

    dispatch(fetchProduits(params));
  }, [pagination.current_page, searchQuery, selectedCategoryId, dispatch]);
  // ↑ pagination.limit intentionnellement absent : on ne veut pas refetch si
  //   le serveur renvoie un limit légèrement différent

  // Recommandations selon l'état d'authentification
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(
        fetchRecommandationsUtilisateur({
          user_id: user.id,
          pays: user.pays || null,
        })
      );
    } else {
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
              key={cat.nom}
              onClick={() => dispatch(setSelectedCategory({ id: cat.id, nom: cat.nom }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategoryNom === cat.nom
                  ? 'bg-[#008294] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#008294] hover:text-[#008294]'
              }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {/* Grille produits + pagination */}
        {error ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Impossible de charger les produits</p>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => dispatch(fetchProduits({
                page: pagination.current_page,
                limit: pagination.limit,
              }))}
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