import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './input.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ImageOverrideProvider } from './context/ImageOverrideContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <CartProvider>
            <ImageOverrideProvider>
              <App />
            </ImageOverrideProvider>
          </CartProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
