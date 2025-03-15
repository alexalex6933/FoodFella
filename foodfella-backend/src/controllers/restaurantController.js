const Restaurant = require('../models/restaurantModel');

/**
 * Get all restaurants with pagination
 * @route GET /api/restaurants
 * @access Public
 */
exports.getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Restaurant.findAll(page, limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurants: result.restaurants,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting restaurants',
    });
  }
};

/**
 * Get restaurant by ID
 * @route GET /api/restaurants/:id
 * @access Public
 */
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error('Error getting restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting restaurant',
    });
  }
};

/**
 * Create a new restaurant
 * @route POST /api/restaurants
 * @access Private (Merchant only)
 */
exports.createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      cuisineType,
      priceRange,
      locations,
      images,
    } = req.body;
    
    // Set merchant ID from authenticated user
    const merchantId = req.user.id;
    
    const restaurant = await Restaurant.create({
      name,
      description,
      cuisineType,
      priceRange,
      merchantId,
      locations,
      images,
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        restaurant,
      },
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating restaurant',
    });
  }
};

/**
 * Update a restaurant
 * @route PUT /api/restaurants/:id
 * @access Private (Merchant only)
 */
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found',
      });
    }
    
    // Check if the restaurant belongs to the authenticated merchant
    if (restaurant.merchantId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this restaurant',
      });
    }
    
    const {
      name,
      description,
      cuisineType,
      priceRange,
      locations,
      images,
    } = req.body;
    
    const updatedRestaurant = await Restaurant.update(req.params.id, {
      name,
      description,
      cuisineType,
      priceRange,
      locations,
      images,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurant: updatedRestaurant,
      },
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating restaurant',
    });
  }
};

/**
 * Delete a restaurant
 * @route DELETE /api/restaurants/:id
 * @access Private (Merchant only)
 */
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found',
      });
    }
    
    // Check if the restaurant belongs to the authenticated merchant
    if (restaurant.merchantId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this restaurant',
      });
    }
    
    await Restaurant.delete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting restaurant',
    });
  }
};

/**
 * Get restaurants by merchant ID
 * @route GET /api/restaurants/merchant
 * @access Private (Merchant only)
 */
exports.getMerchantRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findByMerchantId(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurants,
      },
    });
  } catch (error) {
    console.error('Error getting merchant restaurants:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting merchant restaurants',
    });
  }
}; 