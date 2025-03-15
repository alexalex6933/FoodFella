import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, X, Package, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { addMenuItem, updateMenuItem, deleteMenuItem, mockMenuItems, mockOrders, MenuItem, updateOrderStatus } from '../data/mockData';

const MerchantDashboard = () => {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const { user } = useAuth();
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    priceDepreciation: {
      enabled: false,
      ratePerMinute: 0.1,
      lowerBound: ''
    }
  });

  useEffect(() => {
    setItems(mockMenuItems.filter(item => item.restaurantId === '1'));
  }, []);

  // Filter orders for the current merchant
  const currentOrders = mockOrders.filter(
    order => order.restaurantId === '1' && order.status !== 'ready'
  );
  
  const orderHistory = mockOrders.filter(
    order => order.restaurantId === '1' && order.status === 'ready'
  );

  // Mock data
  const earnings = {
    today: 245.50,
    thisWeek: 1678.90,
    thisMonth: 5430.20
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData: Omit<MenuItem, 'id' | 'createdAt'> = {
      restaurantId: '1',
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      image: newItem.image,
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false
      },
      available: true,
      ...(newItem.priceDepreciation.enabled && {
        priceDepreciation: {
          enabled: true,
          startTime: new Date().toISOString(),
          ratePerMinute: newItem.priceDepreciation.ratePerMinute,
          lowerBound: parseFloat(newItem.priceDepreciation.lowerBound)
        }
      })
    };

    const addedItem = addMenuItem(itemData);
    setItems(prev => [...prev, addedItem]);
    setShowAddItemModal(false);
    resetForm();
  };

  const handleEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updates: Partial<MenuItem> = {
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      image: newItem.image,
      ...(newItem.priceDepreciation.enabled && {
        priceDepreciation: {
          enabled: true,
          startTime: new Date().toISOString(),
          ratePerMinute: newItem.priceDepreciation.ratePerMinute,
          lowerBound: parseFloat(newItem.priceDepreciation.lowerBound)
        }
      })
    };

    const updatedItem = updateMenuItem(editingItem.id, updates);
    if (updatedItem) {
      setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    }
    setShowAddItemModal(false);
    setEditingItem(null);
    resetForm();
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'processing' | 'cooking' | 'ready') => {
    console.log("status " + newStatus)
    updateOrderStatus(orderId, newStatus);
    // Force a re-render by updating the state
    setItems([...items]);
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      description: '',
      price: '',
      image: '',
      priceDepreciation: {
        enabled: false,
        ratePerMinute: 0.1,
        lowerBound: ''
      }
    });
  };

  const startEditing = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      priceDepreciation: {
        enabled: !!item.priceDepreciation,
        ratePerMinute: item.priceDepreciation?.ratePerMinute || 0.1,
        lowerBound: item.priceDepreciation?.lowerBound.toString() || ''
      }
    });
    setShowAddItemModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cooking':
        return <Package className="h-5 w-5 text-orange-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cooking':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

      {/* Menu Items */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Menu Items</h2>
            <button 
              onClick={() => {
                setEditingItem(null);
                resetForm();
                setShowAddItemModal(true);
              }}
              className="flex items-center space-x-2 bg-[#1db954] text-white px-4 py-2 rounded-full hover:bg-[#169c46] transition-colors"
            >
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
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="text-sm text-gray-600">
                      <span>${item.price.toFixed(2)}</span>
                      {item.priceDepreciation?.enabled && (
                        <span className="text-[#1db954] ml-2">
                          Min: ${item.priceDepreciation.lowerBound.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.priceDepreciation?.enabled && (
                      <span className="text-xs text-gray-500">
                        Price depreciation: ${item.priceDepreciation.ratePerMinute}/min
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => startEditing(item)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddItemModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={editingItem ? handleEditItem : handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enablePriceDepreciation"
                    checked={newItem.priceDepreciation.enabled}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      priceDepreciation: {
                        ...newItem.priceDepreciation,
                        enabled: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 text-[#1db954] focus:ring-[#1db954]"
                  />
                  <label htmlFor="enablePriceDepreciation" className="ml-2 text-sm text-gray-700">
                    Enable Price Depreciation
                  </label>
                </div>

                {newItem.priceDepreciation.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate per Minute ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newItem.priceDepreciation.ratePerMinute}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          priceDepreciation: {
                            ...newItem.priceDepreciation,
                            ratePerMinute: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lower Bound Price ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newItem.priceDepreciation.lowerBound}
                        onChange={(e) => setNewItem({
                          ...newItem,
                          priceDepreciation: {
                            ...newItem.priceDepreciation,
                            lowerBound: e.target.value
                          }
                        })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddItemModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1db954] text-white rounded-full hover:bg-[#169c46] transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;