import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../data/mockData';
import { useAuth } from './AuthContext';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart items when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.id}`);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      } else {
        setItems([]); // Clear cart if no saved items for this user
      }
    } else {
      setItems([]); // Clear cart when logged out
    }
  }, [user]);

  // Save cart items whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = (item: MenuItem) => {
    if (!user) return; // Prevent adding to cart if not logged in
    
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    if (!user) return; // Prevent removing from cart if not logged in
    
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    if (!user) return; // Prevent clearing cart if not logged in
    
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};