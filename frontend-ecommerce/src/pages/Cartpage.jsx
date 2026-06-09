import React from 'react'
import { useDispatch,useSelector } from 'react-redux';

const Cartpage = () => {
   const dispatch = useDispatch();
   const cartItems =useSelector((state)=> state.cart.cartItems)
   

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold mb-8'>Panier</h2>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
         <div className='lg:col-span-2 shadow-md p-4 rounded-md'>

         </div>
         <div className='lg:col-span-1'>
          <div className='bg-white shadow-md p-6 rounded-md'>

  <h3 className='text-xl font-bold mb-4'>récapitulatif de la commande</h3>
                 <div className='space-y-2 mb-4'>
                  <div className='flex justify-between'>
                       <span>somme total</span>
                       <span>Total Amount</span>
                  </div>
                  <div className='flex justify-between'>
                       <span>expédition</span>
                       <span>Gratuit</span>
                  </div>
                  <div className='bordert-t pt-2 font-bold'>
                       <span>total</span>
                       <span>Total Amount </span>
                  </div> 
          </div>
               
                  
                 <button>Validation</button>
                 </div>
                 
         </div>
      </div>
    </div>
  )
}

export default Cartpage
