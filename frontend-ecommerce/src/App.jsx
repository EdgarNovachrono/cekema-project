import React from 'react'
import Home from './pages/Home'
import productDetails from './pages/ProductDetail'
import CartPage from './pages/Cartpage'
import Navbar from './Components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App  ()  {
  return <BrowserRouter>
    <Navbar/>
   <Routes>
    
       <Route path="/" element={<Home/>} />
       <Route path="/product" element={<productDetails/>} />
       <Route path="/cart" element={<CartPage/>} />
   </Routes>
  </BrowserRouter>
    
  
}

export default App
