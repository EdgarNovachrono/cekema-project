import React from 'react'
import logo from "../assets/Logo_blanc.png";
import { FaFacebook,FaYoutube,FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="min-h-16 ">
          <div className="flex justify-between items-center flex-col md:flex-row py-10">
            <h2 className="text-4xl text-white font-bold">
              Abonnez-vous à notre newsletter
            </h2>
          <form className="md:w-1/3 w-full mt-8 md:mt-0 relative">
            <input
              type="email"
              placeholder="Entrer votre adresse email"
              className="  bg-gray-200 py-4 px-4 rounded shadow-md w-full"
            />
            <button className="bg-gray-200 py-3 px-4 rounded-full absolute right-3 top-1">
              Soumettre
            </button>
          </form>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 text-white py-8">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <img src={logo}   className="my-4 w-[105px] h-[80px]"/>
                <p>Lorem ipsum dolor sit amet
                   consectetur adipisicing elit. 
                   Qui officia aspernatur ullam modi facilis hic, culpa dicta illum nam. Ipsam eveniet voluptatum doloremque a eos beatae amet quibusdam praesentium? Eveniet.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <FaFacebook size={30} className="text-gray-400 rounded-md p-2"/>
                    <FaXTwitter size={30} className="text-gray-400 rounded-md p-2"/>
                    <FaYoutube size={30} className="text-gray-400 rounded-md p-2"/>  
                    <FaInstagram size={30} className="text-gray-400 rounded-md p-2"/>  
                    
                  </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold my-4">Pages</h2>
                <ul>
                  <li ><Link to="/">Home</Link></li>
                  <li ><Link to="/produits">About</Link></li>
                  <li ><Link to="/contact">FAQS</Link></li>
                  <li ><Link to="/contact">Contact</Link></li>
                </ul>
                </div>
              <div><h2 className="text-2xl font-bold my-4">Categories</h2>
                <ul>
                  <li ><Link to="/">BEAUTY & PERSONAL CARE</Link></li>
                  <li ><Link to="/">HOME & KITCHEN</Link></li>
                  <li ><Link to="/">FASHION</Link></li>
                  <li ><Link to="/">ELECTRONICS</Link></li>
                </ul>
                </div>
              <div>4</div>
            </div>
         </div>
      </div>
    </footer>
  )
}

export default Footer