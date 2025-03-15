import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Leaf, Info } from 'lucide-react';
import { mockRestaurants, mockMenuItems, mockReviews } from '../data/mockData';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const restaurant = mockRestaurants.find(r => r.id === id);
  const menuItems = mockMenuItems.filter(item => item.restaurantId === id);
  const reviews = mockReviews.filter(review => review.restaurantId === id);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission here
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
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {restaurant.cuisineType.map((type) => (
            <span
              key={type}
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
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.isMysteryBag && (
                <div className="bg-[#1db954] text-white px-3 py-1 absolute right-2 top-2 rounded-full text-sm">
                  Mystery Bag
                </div>
              )}
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                    <span className="text-[#1db954] font-bold ml-2">${item.discountedPrice.toFixed(2)}</span>
                  </div>
                  <button className="bg-[#1db954] text-white px-4 py-2 rounded-full hover:bg-[#169c46] transition-colors">
                    Add to Cart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.dietary.vegetarian && (
                    <span className="flex items-center text-xs text-gray-600">
                      <Leaf className="h-4 w-4 mr-1" />
                      Vegetarian
                    </span>
                  )}
                  {item.dietary.vegan && (
                    <span className="flex items-center text-xs text-gray-600">
                      <Leaf className="h-4 w-4 mr-1" />
                      Vegan
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
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
                  key={star}
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
            className="bg-[#1db954] text-white px-6 py-2 rounded-full hover:bg-[#169c46] transition-colors"
          >
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center mb-2">
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
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