/**
 * src/component/auth/ProtectedRoute.jsx
 * Redirige vers /signin si l'utilisateur n'est pas authentifié.
 * Affiche un loader pendant la vérification de la session.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // On stocke la page cible pour y revenir après connexion
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}