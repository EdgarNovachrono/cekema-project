import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { User,ShoppingCart } from 'lucide-react'
import logo from '../assets/Logo_blanc.png'
import { useDispatch,useSelector } from 'react-redux'
import { filterBySearch  } from '../features/products/ProductsSlice'
function Navbar() {
   const [isOpen, setIsOpen] = useState(false);
   // user basculement de l'état du menu déroulant
    const handleUser=() => {
        setIsOpen(!isOpen);
    };
    const dispatch = useDispatch();
    const searchQuery=useSelector((state)=>state.products.searchQuery);

  return <header className='bg-white shadow-md p'>
    <>
      <div className="py-4 shadow-md">
             <ul className="container mx-auto flex flex-wrap
             justify-between md:flex-row px-4 md:px-2 items-center
             ">
                 <div className="flex gap-4 ">
                     <li>
                      <Link to="/">Home</Link>
                     </li>
                     <li>
                      <Link to="/">About</Link>
                     </li>
                     <li>
                      <Link to="/">FAQs</Link>
                     </li>
                     <li>
                      <Link to="/">Contact</Link>
                     </li>
                 </div>
                  <div className={`${isOpen ? "flex flex-col absolute right-0 md:right-0 top-12 z-10 bg-zinc-50 gap-4":"hidden"}`}>
                      <li>
                      <Link to="/">Connexion</Link>
                     </li> 
                      <li>
                      <Link to="/">Mon compte</Link>
                     </li>
                  </div>
                  <User size={40} 
                  className="bg-gray-200 p-2 text-black rounded cursor-pointer"
                  onClick={handleUser}
                  />
             </ul>
      </div>
      <nav className="flex justify-between items-center container
      mx-auto md:py-6 py-8 px-2">
            <div className="flex items-center gap-2">
              <Link to="/" className="bg-gray-700 py-2 px-4 rounded w-[75px] h-[75px]">
                 <img src={logo} alt="Logo" />
              </Link>
            </div>
            <form className="w-1/2 sm:block hidden">
             <input 
             type="text"
              placeholder="rechercher vos produits..."
              className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchQuery}
              onChange={(e)=>dispatch(filterBySearch(e.target.value))}
              />
            </form>
             <Link>
              <ShoppingCart size={40} className="bg-gray-100 px-2 text-black cursor-pointer rounded-full" />
              </Link>
      </nav>
    </>
    </header>
}

export default Navbar
