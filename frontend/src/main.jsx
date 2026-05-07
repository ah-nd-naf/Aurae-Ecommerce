import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // 1. Imported correctly
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* 2. Wrap App here so everything inside can see the Auth state */}
      <AuthProvider> 
        <CartProvider>
          <App /> {/* Wrap App with CartProvider */}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)