import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, User, LogOut, ShoppingCart, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCartClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/cart');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.type === 'merchant') {
      navigate('/merchant/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-[#1db954] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={handleLogoClick} className="flex items-center space-x-2">
              <Leaf className="h-8 w-8" />
              <span className="font-bold text-xl">FoodFella</span>
            </button>
            
            <div className="flex items-center space-x-4">
              {user?.type !== 'merchant' && (
                <button 
                  onClick={handleCartClick}
                  className="hover:text-green-200 transition-colors relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {user && getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-[#1db954] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {getItemCount()}
                    </span>
                  )}
                </button>
              )}
              {user ? (
                <>
                  <span className="text-sm">{user.email}</span>
                  <button
                    onClick={logout}
                    className="hover:text-green-200 transition-colors"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <Link to="/auth" className="hover:text-green-200 transition-colors">
                  <User className="h-6 w-6" />
                </Link>
              )}
              <button 
                onClick={handleMenuClick}
                className="hover:text-green-200 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu */}
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button 
              onClick={handleCloseMenu}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleNavigate('/orders')}
              className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => handleNavigate('/settings')}
              className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCloseMenu}
        />
      )}
    </>
  );
};

export default Navbar;