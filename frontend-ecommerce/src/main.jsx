import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// AuthProvider supprimé — l'auth est gérée uniquement par Redux dans App.jsx
// Avoir les deux (Context + Redux) créait un conflit d'état et bloquait les redirections

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)