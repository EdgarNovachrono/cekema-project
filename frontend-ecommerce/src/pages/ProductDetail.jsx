import React from 'react'
import { Link,useParams } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useDispatch,useSelector } from 'react-redux';
import { addToCart } from '../features/Cart/CartSlice';

const ProductDetail = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.items.find((item) => item.id === parseInt(id)));
  if (!product) {
    return <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className='text-2xl font-bold mb-4'>Produit non trouvé</h2>
         <Link to="/" className="text-blue-500 hover:text-blue-700">
           Retour a l'Accueil
         </Link>
      </div>
      
      </div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <Link to="/" className="mb-8 inline-block"> Retour aux produits</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         <div className="shadow-md p-4 rounded w-[600px]">
          <img src={product.image} alt={product.nom} />
         </div>
         <div>
          <h1 className="text-3xl font-bold mb-4">{product.nom}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="mb-6">
             <span className="text-3xl font-bold">${product.prix.toFixed(2)}</span>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Categorie</h3>
             <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm">{product.categorie}</span>
          </div>
           <button className="w-full md:w-auto bg-zinc-200 px-8 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-zinc-300 " onClick={() => dispatch(addToCart(product))}>
          <ShoppingCart />
            Ajouter au panier
         </button>
         </div>
        
      </div>
      </div>
    </div>
  )
}

export default ProductDetail
