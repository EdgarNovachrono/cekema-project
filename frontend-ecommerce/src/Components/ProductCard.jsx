import React from 'react'
import { Link } from 'react-router-dom';

function ProductCard({produit}) {
  return (
    <Link>
    <div classname='shadow-lg rounded-md cursor-pointer'>
        <img src={produit.image}  className='w-full h-48 object-cover rounded-t-md' />
          <div className="bg-gray-50 p-4">
                  <h2 className="text-lg font-semibold my-4 ">{produit.nom.substring(0, 30)+"..."}</h2>
                    <p className="text-sm text-zinc-500 border-b-2 pb-4">{produit.description.substring(0, 70)+"..."}</p>
          
          <div className="flex justify-between items-center mt-4">
            <p className=" text-lg">${produit.prix.toFixed(2)}</p>
               <p>View Details</p>
          </div>
        </div>  
    </div>
    </Link>
  )
}

export default ProductCard
