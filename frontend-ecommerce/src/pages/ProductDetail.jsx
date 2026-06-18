import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, ArrowLeft, MapPin } from 'lucide-react';
import { addToCart } from '../features/Cart/CartSlice';
import StarRating from './avis/StarRating';
import { fetchProduitsSimilaires } from '../features/recommendations/recommendationsSlice';
import RecommendationSection from '../Components/RecommendationSection';
import AvisSection from './avis/AvisSection';
import { produitsApi, trackingApi } from '../service/api';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const productFromStore = useSelector((state) =>
    state.products.items.find((item) => item.id === parseInt(id))
  );
  const { similaires, isLoading: recoLoading } = useSelector(
    (state) => state.recommendations
  );

  const [product, setProduct] = useState(productFromStore || null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!productFromStore);
  
  // ← TOUS les hooks ici, avant tout return conditionnel
  const vueSent = useRef(false);

  // Fetch produit si pas dans le store
  useEffect(() => {
    if (productFromStore) {
      setProduct(productFromStore);
      setIsLoadingProduct(false);
    } else {
      produitsApi.getById(id)
        .then((data) => {
          if (data.success && data.produit) setProduct(data.produit);
        })
        .catch(() => {})
        .finally(() => setIsLoadingProduct(false));
    }
  }, [id, productFromStore]);

  // Tracking vue + produits similaires
  useEffect(() => {
    if (product?.id && !vueSent.current) {
      vueSent.current = true;
      trackingApi.vue(product.id);
      dispatch(fetchProduitsSimilaires({
        produit_id: product.id,
        pays: user?.pays || null,
      }));
    }
  }, [product?.id, dispatch, user?.pays]);

  // ← return conditionnels APRÈS tous les hooks
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#008294] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Produit introuvable</h2>
          <p className="text-gray-500 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-[#008294] text-white px-6 py-3 rounded-lg hover:bg-[#006b7a] transition-colors">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => dispatch(addToCart(product));
  const prix = Number(product.prix_unitaire || product.prix || 0);
  const note = Number(product.note_moyenne || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#008294] mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Retour aux produits
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-gray-50 flex items-center justify-center p-8 min-h-64">
              <img
                src={product.image_principale || product.image || 'https://via.placeholder.com/500x400?text=Produit'}
                alt={product.nom}
                className="max-h-96 max-w-full object-contain rounded-xl"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=Image+indisponible'; }}
              />
            </div>

            <div className="p-8 flex flex-col gap-4">
              <span className="inline-block bg-[#008294]/10 text-[#008294] text-xs font-semibold px-3 py-1 rounded-full w-fit">
                {product.categorie || 'Produit'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.nom}</h1>

              {note > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating note={note} size={16} />
                  <span className="text-sm text-gray-500">{note.toFixed(1)} / 5</span>
                </div>
              )}

              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              )}

              {(product.adresse || product.ville) && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <MapPin size={14} />
                  <span>{product.adresse || product.ville}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100">
                {product.materiaux && <div><p className="text-xs text-gray-400">Matériaux</p><p className="text-sm font-medium text-gray-700">{product.materiaux}</p></div>}
                {product.couleur && <div><p className="text-xs text-gray-400">Couleur</p><p className="text-sm font-medium text-gray-700">{product.couleur}</p></div>}
                {product.taille && <div><p className="text-xs text-gray-400">Taille</p><p className="text-sm font-medium text-gray-700">{product.taille}</p></div>}
                {product.stock !== undefined && (
                  <div>
                    <p className="text-xs text-gray-400">Stock</p>
                    <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? `${product.stock} disponible(s)` : 'Rupture de stock'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{prix.toLocaleString('fr-FR')}</span>
                <span className="text-lg text-gray-500 font-medium">FCFA</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-2 w-full bg-[#008294] text-white py-3.5 rounded-xl font-semibold hover:bg-[#006b7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <RecommendationSection
            title="Produits similaires"
            produits={similaires}
            source="content"
            isLoading={recoLoading}
          />
          <AvisSection
            produit_id={product.id}
            note_moyenne={note}
            nb_avis_initial={product.nb_avis || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;