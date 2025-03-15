import React, { useState } from 'react';
import { PlusCircle, DollarSign, Package, Settings } from 'lucide-react';

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('items');

  // Mock data
  const earnings = {
    today: 245.50,
    thisWeek: 1678.90,
    thisMonth: 5430.20
  };

  const items = [
    {
      id: '1',
      name: 'Mystery Lunch Bag',
      price: 25.00,
      discountedPrice: 12.50,
      available: true
    },
    // Add more items as needed
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
        <p className="text-gray-600">Welcome back, Green Garden Cafe</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600">Today's Earnings</h3>
            <DollarSign className="h-5 w-5 text-[#1db954]" />
          </div>
          <p className="text-2xl font-bold mt-2">${earnings.today.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600">This Week</h3>
            <DollarSign className="h-5 w-5 text-[#1db954]" />
          </div>
          <p className="text-2xl font-bold mt-2">${earnings.thisWeek.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600">This Month</h3>
            <DollarSign className="h-5 w-5 text-[#1db954]" />
          </div>
          <p className="text-2xl font-bold mt-2">${earnings.thisMonth.toFixed(2)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('items')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'items'
                  ? 'border-[#1db954] text-[#1db954]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-[#1db954] text-[#1db954]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-[#1db954] text-[#1db954]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'items' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Menu Items</h2>
                <button className="flex items-center space-x-2 bg-[#1db954] text-white px-4 py-2 rounded-full hover:bg-[#169c46] transition-colors">
                  <PlusCircle className="h-5 w-5" />
                  <span>Add New Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-sm text-gray-600">
                        <span className="line-through">${item.price.toFixed(2)}</span>
                        <span className="text-[#1db954] ml-2">${item.discountedPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-600 hover:text-gray-900">Edit</button>
                      <button className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
              {/* Add orders list here */}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Restaurant Settings</h2>
              {/* Add settings form here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;