import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 mt-16">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#008294] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-white text-lg">Cekema</span>
          </div>
          <p className="text-sm leading-relaxed">
            La marketplace africaine pensée pour les réalités locales. 
            Achetez et vendez en toute confiance.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Navigation</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <Link to="/cart" className="hover:text-white transition-colors">Mon panier</Link>
            <Link to="/signin" className="hover:text-white transition-colors">Connexion</Link>
            <Link to="/signup" className="hover:text-white transition-colors">S'inscrire</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Paiements acceptés</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span> MTN Mobile Money</span>
            <span>Orange Money</span>
            <span> Wave</span>
            <span>Cash à la livraison</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
        <p>© 2024 Cekema Online Market. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
);

export default Footer;