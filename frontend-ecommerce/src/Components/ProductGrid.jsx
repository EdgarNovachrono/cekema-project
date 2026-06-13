import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { addToCart } from '../features/Cart/CartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const prix = Number(product.prix_unitaire || product.prix || 0);
  const note = Number(product.note_moyenne || 0);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img
          src={product.image_principale || product.image || 'https://via.placeholder.com/300x200?text=Produit'}
          alt={product.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=?';
          }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {product.categorie || 'Produit'}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug flex-1">
          {product.nom}
        </h3>

        {note > 0 && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">{note.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div>
            <span className="text-base font-bold text-gray-900">
              {prix.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs text-gray-400 ml-1">FCFA</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (product.stock !== 0) dispatch(addToCart(product));
            }}
            disabled={product.stock === 0}
            className="flex items-center gap-1 bg-[#008294] text-white text-xs px-3 py-1.5 rounded-lg hover:bg-[#006b7a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={12} />
            Ajouter
          </button>
        </div>
      </div>
    </Link>
  );
};

const ProductGrid = () => {
  const { filteredItems, isLoading } = useSelector((state) => state.products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-400 text-sm">
          Essayez une autre catégorie ou modifiez votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;