
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '../features/Cart/CartSlice';
import { setPage, selectPagination, selectTotalPages } from '../features/products/ProductsSlice';

// ============================================================
// Carte produit
// ============================================================
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

// ============================================================
// Pagination
// ============================================================
const Pagination = ({ pagination, totalPages, onPageChange }) => {
  const { current_page, total_items } = pagination;

  if (totalPages <= 1) return null;

  // Génère les numéros à afficher : toujours la 1re, la dernière,
  // et les 2 voisins de la page courante
  const pageNums = new Set([1, totalPages]);
  for (let i = Math.max(1, current_page - 2); i <= Math.min(totalPages, current_page + 2); i++) {
    pageNums.add(i);
  }
  const sorted = [...pageNums].sort((a, b) => a - b);

  // Insère des '…' entre les sauts
  const items = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push('ellipsis-' + p);
    items.push(p);
    prev = p;
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-8">

      {/* Compteur */}
      <p className="text-sm text-gray-400">
        {total_items.toLocaleString('fr-FR')} produit{total_items > 1 ? 's' : ''} —
        page {current_page} sur {totalPages}
      </p>

      {/* Boutons */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {/* Précédent */}
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-[#008294] hover:text-[#008294] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
          Préc.
        </button>

        {/* Numéros */}
        {items.map((item) => {
          if (typeof item === 'string') {
            return (
              <span key={item} className="px-2 py-2 text-gray-400 text-sm select-none">
                …
              </span>
            );
          }
          const isActive = item === current_page;
          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#008294] text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-[#008294] hover:text-[#008294]'
              }`}
            >
              {item}
            </button>
          );
        })}

        {/* Suivant */}
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-[#008294] hover:text-[#008294] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Suiv.
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// ============================================================
// Grille principale
// ============================================================
const ProductGrid = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.products);
  const pagination = useSelector(selectPagination);
  const totalPages = useSelector(selectTotalPages);

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    // Remonte en haut de la grille produits
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
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
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        pagination={pagination}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ProductGrid;