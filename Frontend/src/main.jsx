import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./Context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
)
