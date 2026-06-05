/**
 * src/App.jsx
 * Le LoginNotificationModal est placé ici au niveau racine
 * pour qu'il soit disponible sur toutes les pages après connexion.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar    from './component/nav/Navbar';
import Footer    from './component/footer/Footer';
import Home      from './pages/home/Home';
import Progrmas  from './pages/programs/Progrmas';
import SingIn    from './pages/auth/signin/SingIn';
import SingUp    from './pages/auth/signup/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute        from './component/auth/ProtectedRoute';
import LoginNotificationModal from './component/notifications/LoginNotificationModal';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="w-full bg-neutral-50 flex min-h-screen flex-col text-neutral-500">
      <Navbar />

      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/programs" element={<Progrmas />} />
        <Route path="/signin"   element={<SingIn />} />
        <Route path="/signup"   element={<SingUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />

      {/*
        Modal de notification — placé en dehors du layout normal
        pour se superposer à tout le contenu.
        S'affiche automatiquement à chaque connexion.
      */}
      <LoginNotificationModal isAuthenticated={isAuthenticated} />
    </main>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;