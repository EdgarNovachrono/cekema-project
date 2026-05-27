import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./component/nav/Navbar"
import Footer from "./component/footer/Footer"
import Home from "./pages/home/Home"
import Progrmas from "./pages/programs/Progrmas"


function App() {
  return (
    <>
      <Router>
        <main className="w-full bg-neutral-50 flex min-h-screen flex-col text-neutral-500">
          {/* Navbar section */}
          <Navbar />

          {/* Routes */}
          {
           <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<Progrmas />} />

          </Routes> 
          
          }

          {/* Footer Section */}
          <Footer />
        </main>
      </Router>
    </>
  )
}

export default App
