import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCart, Search, User, LogOut, Menu, X, ChevronDown,
} from 'lucide-react';
import { filterBySearch } from '../features/products/ProductsSlice';
import { selectCartCount } from '../features/Cart/CartSlice';
import { logoutUser } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartCount = useSelector(selectCartCount);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    dispatch(filterBySearch(e.target.value));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#008294] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              Cekema
            </span>
          </Link>

          {/* Recherche */}
          <div className="flex-1 max-w-md hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              onChange={handleSearch}
              className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Panier */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 text-gray-700 hover:text-[#008294] transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#008294] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#008294] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#008294] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {(user.prenom || user.nom || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block font-medium">
                    {user.prenom || user.nom}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-500">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={14} />
                      Mon profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={14} />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="text-sm text-gray-700 hover:text-[#008294] font-medium transition-colors hidden sm:block"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-[#008294] text-white px-4 py-2 rounded-lg hover:bg-[#006b7a] transition-colors font-medium"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Recherche mobile */}
        {menuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                onChange={handleSearch}
                className="bg-transparent flex-1 text-sm outline-none text-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;