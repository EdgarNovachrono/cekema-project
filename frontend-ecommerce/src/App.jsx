import React from 'react'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetail'
import CartPage from './pages/Cartpage'
import Navbar from './Components/Navbar'
import { Provider } from "react-redux"
import store from "./App/store"

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App