import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './app/store';
import RecommendationPopup from './Components/RecommendationPopup';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cartpage';
import SignIn from './pages/auth/signin/SingIn';
import SignUp from './pages/auth/signup/SignUp';
import { fetchPanier } from './features/Cart/CartSlice';
import { fetchCurrentUser } from './features/auth/authSlice';
import { tokenStorage } from './service/api';

// Gestion de l'initialisation propre de l'application
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Si un jeton existe, on récupère le profil de l'utilisateur connecté
        if (tokenStorage.get()) {
          await dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        // Optionnel : tokenStorage.clear() si le token est expiré/invalide
      } finally {
        // 2. On charge le panier (qu'on soit connecté ou en mode invité)
        await dispatch(fetchPanier());
        // 3. L'application est prête à être affichée
        setIsInitialized(true);
      }
    };

    initApp();
  }, [dispatch]);

  // Évite les flashs d'interface bizarres pendant le chargement initial
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008294]"></div>
        <p className="mt-4 text-gray-600 font-medium">Chargement de Cekema Market...</p>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
          <RecommendationPopup />
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;