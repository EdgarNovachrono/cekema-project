import React from 'react'

import ProductCard from './ProductCard';  
import { useSelector } from 'react-redux';

function ProductGrid() {
  const produits=useSelector((state)=>state.products.filteredItems);
  return (
    <div className="grid grid-col-1 md:grid-col-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 my-24">
        {produits.map((produit)=>{
            return(
                
                <ProductCard key={produit.id} produit={produit} />
            );
        })}
    </div>
  )
}

export default ProductGrid