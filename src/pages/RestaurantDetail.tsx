import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Leaf } from 'lucide-react';
import { mockRestaurants, mockMenuItems, mockReviews, addReview } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { usePrice } from '../contexts/PriceContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { getCurrentPrice } = usePrice();
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({});
  
  const restaurant = mockRestaurants.find(r => r.id === id);
  const menuItems = mockMenuItems.filter(item => item.restaurantId === id);

  // Initialize reviews from mock data
  useEffect(() => {
    const restaurantReviews = mockReviews.filter(review => review.restaurantId === id);
    setReviews(restaurantReviews);
  }, [id]);

  // Update prices in real-time for items with price depreciation
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices = menuItems.reduce((acc, item) => {
        if (item.priceDepreciation?.enabled) {
          acc[item.id] = getCurrentPrice(item);
        }
        return acc;
      }, {} as { [key: string]: number });
      setCurrentPrices(newPrices);
    }, 1000);

    return () => clearInterval(interval);
  }, [menuItems, getCurrentPrice]);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const handleAddToCart = (item: typeof menuItems[0]) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    addToCart(item);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }

    const newReviewData = addReview({
      restaurantId: id!,
      userId: user.id,
      rating: newReview.rating,
      comment: newReview.comment
    });

    setReviews(prev => [...prev, newReviewData]);
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restaurant Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <p>{restaurant.address}</p>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="ml-1">{restaurant.rating}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-1" />
            <span>{restaurant.availableHours.open} - {restaurant.availableHours.close}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {restaurant.cuisineType.map((type, index) => (
            <span
              key={`cuisine-${index}`}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const currentPrice = item.priceDepreciation?.enabled
              ? currentPrices[item.id] || getCurrentPrice(item)
              : item.price;
            
            return (
              <div
                key={`menu-${item.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                      <span className="text-[#1db954] font-bold ml-2">${currentPrice.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        user 
                          ? 'bg-[#1db954] text-white hover:bg-[#169c46]' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {user ? 'Add to Cart' : 'Sign in to Add'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.dietary.vegetarian && (
                      <span key={`dietary-veg-${item.id}`} className="flex items-center text-xs text-gray-600">
                        <Leaf className="h-4 w-4 mr-1" />
                        Vegetarian
                      </span>
                    )}
                    {item.dietary.vegan && (
                      <span key={`dietary-vegan-${item.id}`} className="flex items-center text-xs text-gray-600">
                        <Leaf className="h-4 w-4 mr-1" />
                        Vegan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
        
        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`rating-star-${star}`}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`${
                    star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-2 rounded-full transition-colors ${
              user 
                ? 'bg-[#1db954] text-white hover:bg-[#169c46]' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {user ? 'Submit Review' : 'Sign in to Review'}
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={`review-${review.id}`} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center mb-2">
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={`review-${review.id}-star-${i}`} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{review.date}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;