import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { EventProvider } from './Contexts/EventsContext'
import { CartProvider } from './Contexts/CartContext'
import { AuthProvider } from './Contexts/AuthContex'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <EventProvider>
    <BrowserRouter>
    <CartProvider>
    <App/>
    </CartProvider>
    </BrowserRouter>
    </EventProvider>
    </AuthProvider>
  </StrictMode>,
)
