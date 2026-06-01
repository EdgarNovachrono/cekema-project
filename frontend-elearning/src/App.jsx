/**
 * src/App.jsx
 * Router principal — avec route /dashboard protégée.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/nav/Navbar';
import Footer from './component/footer/Footer';
import Home from './pages/home/Home';
import Progrmas from './pages/programs/Progrmas';
import SingIn from './pages/auth/signin/SingIn';
import SingUp from './pages/auth/signup/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './component/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        <main className="w-full bg-neutral-50 flex min-h-screen flex-col text-neutral-500">
          <Navbar />

          <Routes>
            {/* Pages publiques */}
            <Route path="/"         element={<Home />} />
            <Route path="/programs" element={<Progrmas />} />
            <Route path="/signin"   element={<SingIn />} />
            <Route path="/signup"   element={<SingUp />} />

            {/* Dashboard apprenant — protégé */}
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
        </main>
      </Router>
    </>
  );
}

export default App;