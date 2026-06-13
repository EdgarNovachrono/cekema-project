import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import {
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartTotal,
} from '../features/Cart/CartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  // Bug corrigé : total = prix * quantité (pas prix + quantité)
  const total = useSelector(selectCartTotal);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-500 mb-6">
            Ajoutez des produits pour commencer vos achats.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#008294] text-white px-6 py-3 rounded-xl hover:bg-[#006b7a] transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="text-gray-400 hover:text-[#008294] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Mon panier
            <span className="ml-2 text-base font-normal text-gray-400">
              ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Liste articles */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => {
              const prix = Number(item.prix_unitaire || item.prix || 0);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4"
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <img
                      src={
                        item.image_principale ||
                        item.image ||
                        'https://via.placeholder.com/100x100?text=Produit'
                      }
                      alt={item.nom}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/100x100?text=?';
                      }}
                    />
                  </Link>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">
                      {item.categorie || 'Produit'}
                    </p>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-semibold text-gray-800 hover:text-[#008294] transition-colors line-clamp-2 text-sm"
                    >
                      {item.nom}
                    </Link>

                    {/* Quantité */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">
                      {(prix * item.quantity).toLocaleString('fr-FR')} FCFA
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {prix.toLocaleString('fr-FR')} FCFA / unité
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Résumé commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Récapitulatif
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Sous-total (
                    {cartItems.reduce((s, i) => s + i.quantity, 0)} articles)
                  </span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600 font-medium">Gratuite</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-[#008294] text-white py-3.5 rounded-xl font-semibold hover:bg-[#006b7a] transition-colors">
                Valider la commande
              </button>

              <Link
                to="/"
                className="block text-center mt-3 text-sm text-gray-500 hover:text-[#008294] transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;