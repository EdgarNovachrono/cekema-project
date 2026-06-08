import React from 'react'
import maBanniere from "../assets/28ad0309a75a9430d8e7ff9e7bf1ad38 (1).jpg";
import  {categories}  from '../contanst/categories';
import ProductGrid from '../Components/ProductGrid';
import Footer from '../Components/Footer';
import { useDispatch } from 'react-redux';
import { setSelectedCategory } from '../features/products/ProductsSlice';
const Home = () => {
  
  const dispatch=useDispatch();
  return (
    <div>
      <div 
      className="w-full h-[50vh] md:h-[65vh] overflow-hidden relative bg-[#008294]"  >
       <img 
        src={maBanniere} 
        alt="Vigour Graphics Banner" 
        />
      </div>
      <div className="container mx-auto  my-10 py-8">
        <div className="flex items-center gap-4">
        {categories.map((cat)=>{
            return(
  <button className="bg-gray-300 py-2 px-4 rounded-md text-black activate:scale-105
          hover:bg-zinc-400 transition-all ease-in" key={cat} onClick={()=>dispatch(setSelectedCategory(cat))}>
            {cat}
          </button>
            );
        })}
        </div>
      <ProductGrid/>
      </div>

      <Footer/>
    </div>
  )
}

export default Home
