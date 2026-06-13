import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './app/store';

import Navbar from './Components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cartpage';
import SignIn from './pages/auth/signin/SingIn';
import SignUp from './pages/auth/signup/SignUp';

import { fetchCurrentUser } from './features/auth/authSlice';
import { tokenStorage } from './service/api';

// Restaure la session si un token existe
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (tokenStorage.get()) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  return children;
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
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;