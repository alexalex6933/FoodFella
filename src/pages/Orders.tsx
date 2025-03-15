import React from 'react';
import { mockOrders, mockRestaurants, mockMenuItems } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Package, Clock, CheckCircle, Store } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  
  const currentOrders = mockOrders.filter(
    order => order.userId === user?.id && order.status !== 'ready'
  );
  
  const previousOrders = mockOrders.filter(
    order => order.userId === user?.id && order.status === 'ready'
  );

  const getRestaurantName = (restaurantId: string) => {
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    return restaurant?.name || 'Unknown Restaurant';
  };

  const getItemName = (itemId: string) => {
    const item = mockMenuItems.find(i => i.id === itemId);
    return item?.name || 'Unknown Item';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'cooking':
        return 'Being Prepared';
      case 'ready':
        return 'Ready for Pickup';
      default:
        return status;
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f9f7] flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view orders</h2>
          <p className="text-gray-600">Please sign in to see your order history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Current Orders */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Orders</h2>
        {currentOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No current orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Order #{order.id}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-4 text-gray-600">
                  <Store className="h-4 w-4" />
                  <span>{getRestaurantName(order.restaurantId)}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Ordered at: {formatDateTime(order.createdAt)}
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.itemId} className="flex justify-between text-sm">
                      <span>{getItemName(item.itemId)} × {item.quantity}</span>
                      <span>${item.priceAtPurchase.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Previous Orders */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
        {previousOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No previous orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {previousOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    Completed
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    Order #{order.id}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-4 text-gray-600">
                  <Store className="h-4 w-4" />
                  <span>{getRestaurantName(order.restaurantId)}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Ordered at: {formatDateTime(order.createdAt)}
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.itemId} className="flex justify-between text-sm">
                      <span>{getItemName(item.itemId)} × {item.quantity}</span>
                      <span>${item.priceAtPurchase.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;