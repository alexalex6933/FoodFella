import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { PriceProvider } from './contexts/PriceContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import MerchantDashboard from './pages/MerchantDashboard';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <PriceProvider>
            <div className="min-h-screen bg-[#f7f9f7]">
              <Navbar />
              <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/customer/dashboard" element={<Home />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </PriceProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;