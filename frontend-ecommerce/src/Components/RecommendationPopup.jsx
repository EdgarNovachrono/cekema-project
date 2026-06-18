import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Star, TrendingUp, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, ajouterAuPanier } from '../features/Cart/CartSlice';
import { useRecommendationPopup } from '../Hook/useRecommendationPopup';
import './RecommendationPopup.css';

const formatPrix = (prix) =>
  new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(prix);

const PopupProductCard = ({ produit, onNavigate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || { user: null });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (user) {
      // Utilisateur connecté -> API PHP
      dispatch(ajouterAuPanier({ 
        produit_id: produit.id, 
        quantite: 1, 
        produit: produit 
      }));
    } else {
      // Utilisateur invité -> Store Redux Local
      dispatch(addToCart(produit));
    }
  };

  // Gestion dynamique et sécurisée des images pré-formatées par MinIO
  const getImageUrl = () => {
    const imgRaw = produit.image_principale || produit.image;
    if (!imgRaw) return null;
    if (imgRaw.startsWith('http://') || imgRaw.startsWith('https://')) {
      return imgRaw;
    }
    return `http://localhost:9000/cekema-products/${imgRaw}`;
  };

  const imageSrc = getImageUrl();

  return (
    <div
      className="popup-product-card"
      onClick={() => onNavigate(produit.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onNavigate(produit.id)}
      aria-label={`Voir ${produit.nom}`}
    >
      <div className="popup-product-image">
        {imageSrc ? (
          <img src={imageSrc} alt={produit.nom} loading="lazy" />
        ) : (
          <div className="popup-product-image-placeholder">
            <ShoppingCart size={24} />
          </div>
        )}
        {produit.note_moyenne > 0 && (
          <div className="popup-product-badge">
            <Star size={10} fill="currentColor" className="text-yellow-400" />
            <span>{Number(produit.note_moyenne).toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="popup-product-info">
        <p className="popup-product-name">{produit.nom}</p>
        <p className="popup-product-price">{formatPrix(produit.prix_unitaire || produit.prix)}</p>
        {produit.nb_achats > 0 && (
          <p className="popup-product-sales">{produit.nb_achats} achat{produit.nb_achats > 1 ? 's' : ''}</p>
        )}
      </div>

      <button
        className="popup-product-cart-btn"
        onClick={handleAddToCart}
        aria-label={`Ajouter ${produit.nom} au panier`}
        title="Ajouter au panier"
      >
        <ShoppingCart size={14} />
      </button>
    </div>
  );
};

const RecommendationPopup = () => {
  const navigate = useNavigate();
  const {
    isVisible,
    produits,
    mode,
    label,
    timeLeft,
    isPaused,
    isLoading,
    dismiss,
    handleMouseEnter,
    handleMouseLeave,
    POPUP_DURATION,
  } = useRecommendationPopup();

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
    dismiss();
  };

  if (!isVisible || produits.length === 0) return null;

  const progressPercent = (timeLeft / (POPUP_DURATION / 1000)) * 100;
  const ModeIcon = mode === 'collaborative' ? Users : TrendingUp;

  return (
    <div
      className={`recommendation-popup ${isVisible ? 'recommendation-popup--visible' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="dialog"
      aria-modal="false"
      aria-label="Recommandations de produits"
    >
      <div className="popup-progress-track" aria-hidden="true">
        <div
          className={`popup-progress-bar ${isPaused ? 'popup-progress-bar--paused' : ''}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="popup-header">
        <div className="popup-header-left">
          <div className="popup-mode-icon" aria-hidden="true">
            <ModeIcon size={14} />
          </div>
          <span className="popup-label">{label}</span>
        </div>
        <div className="popup-header-right">
          <span className="popup-timer" aria-live="polite" aria-atomic="true">
            {timeLeft}s
          </span>
          <button
            className="popup-close-btn"
            onClick={dismiss}
            aria-label="Fermer les recommandations"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="popup-products-grid">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="popup-product-skeleton" aria-hidden="true">
              <div className="skeleton-image" />
              <div className="skeleton-line skeleton-line--long" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ))
        ) : (
          produits.map((produit) => (
            <PopupProductCard
              key={produit.id}
              produit={produit}
              onNavigate={handleNavigate}
            />
          ))
        )}
      </div>

      <div className="popup-footer">
        <span className="popup-footer-hint">
          {isPaused ? 'Reprend quand vous quittez' : `Se ferme dans ${timeLeft}s`}
        </span>
      </div>
    </div>
  );
};

export default RecommendationPopup;