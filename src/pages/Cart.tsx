import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { usePrice } from '../contexts/PriceContext';

const Cart = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const { getCurrentPrice } = usePrice();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const subtotal = items.reduce((sum, item) => sum + (getCurrentPrice(item) * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment processing here
    clearCart();
    alert('Order placed successfully!');
    setShowCheckout(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f9f7] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some delicious deals to your cart!</p>
          <Link
            to="/"
            className="bg-[#1db954] text-white px-6 py-2 rounded-full hover:bg-[#169c46] transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={checkoutForm.postalCode}
                    onChange={(e) => setCheckoutForm({...checkoutForm, postalCode: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{16}"
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  value={checkoutForm.cardNumber}
                  onChange={(e) => setCheckoutForm({...checkoutForm, cardNumber: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={checkoutForm.expiryDate}
                    onChange={(e) => setCheckoutForm({...checkoutForm, expiryDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{3,4}"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    value={checkoutForm.cvv}
                    onChange={(e) => setCheckoutForm({...checkoutForm, cvv: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowCheckout(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              className="bg-[#1db954] text-white px-6 py-2 rounded-full hover:bg-[#169c46] transition-colors"
            >
              Place Order (${total.toFixed(2)})
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover"
                />
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  <div className="mt-2">
                    <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                    <span className="text-[#1db954] font-bold ml-2">
                      ${getCurrentPrice(item).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-4 text-red-500 hover:text-red-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-[#1db954] text-white py-2 px-4 rounded-full mt-6 hover:bg-[#169c46] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;