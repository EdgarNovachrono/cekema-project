import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Sparkles, Users, TrendingUp } from 'lucide-react';
import { addToCart } from '../features/Cart/CartSlice';

// Badge selon la source de recommandation
const SourceBadge = ({ source }) => {
  const config = {
    collaborative: {
      icon: <Users size={12} />,
      label: 'Recommandé pour vous',
      className: 'bg-blue-100 text-blue-700',
    },
    content: {
      icon: <Sparkles size={12} />,
      label: 'Produit similaire',
      className: 'bg-purple-100 text-purple-700',
    },
    popular: {
      icon: <TrendingUp size={12} />,
      label: 'Populaire',
      className: 'bg-orange-100 text-orange-700',
    },
  };
  const c = config[source] || config.popular;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.className}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
};

// Carte produit recommandé
const RecoCard = ({ produit, source }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(produit));
  };

  return (
    <Link
      to={`/product/${produit.id}`}
      className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        <img
          src={produit.image_principale || produit.image || '/placeholder.jpg'}
          alt={produit.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Produit';
          }}
        />
        <div className="absolute top-2 left-2">
          <SourceBadge source={source} />
        </div>
      </div>

      {/* Infos */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {produit.categorie || 'Produit'}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
          {produit.nom}
        </h3>

        {/* Note */}
        {produit.note_moyenne && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">
              {Number(produit.note_moyenne).toFixed(1)}
            </span>
          </div>
        )}

        {/* Prix + bouton */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="text-base font-bold text-gray-900">
            {Number(produit.prix_unitaire || produit.prix || 0).toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-normal text-gray-500">FCFA</span>
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-[#008294] text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#006b7a] transition-colors"
          >
            <ShoppingCart size={12} />
            Ajouter
          </button>
        </div>
      </div>
    </Link>
  );
};

// Composant principal
const RecommendationSection = ({ title, produits, source, isLoading }) => {
  if (isLoading) {
    return (
      <section className="my-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!produits || produits.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <SourceBadge source={source} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {produits.slice(0, 8).map((produit) => (
          <RecoCard key={produit.id} produit={produit} source={source} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;