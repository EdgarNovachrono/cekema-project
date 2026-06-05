import React from 'react'
import { produits } from "../contanst/produits" 
import ProductCard from './ProductCard';  

function ProductGrid() {
  
  return (
    <div className="grid grid-col-1 md:grid-col-2 lg:grid-cols-3 xl:grid-cols-4 gap-16 my-24">
        {produits.map((produit)=>{
            return(
                
                <ProductCard key={produit} produit={produit} />
            );
        })}
    </div>
  )
}

export default ProductGrid