import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, User, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#1db954] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <span className="font-bold text-xl">EcoEats</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="hover:text-green-200 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-white text-[#1db954] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                0
              </span>
            </Link>
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
            <button className="hover:text-green-200 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;