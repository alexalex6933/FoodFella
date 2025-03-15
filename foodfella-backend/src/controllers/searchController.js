const Restaurant = require('../models/restaurantModel');

/**
 * Search restaurants by criteria
 * @route GET /api/search
 * @access Public
 */
exports.searchRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Extract search criteria from query parameters
    const criteria = {};
    
    if (req.query.cuisineType) {
      criteria.cuisineType = req.query.cuisineType;
    }
    
    if (req.query.city) {
      criteria.city = req.query.city;
    }
    
    if (req.query.priceRange) {
      criteria.priceRange = req.query.priceRange;
    }
    
    if (req.query.minRating) {
      criteria.minRating = parseFloat(req.query.minRating);
    }
    
    const result = await Restaurant.search(criteria, page, limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurants: result.restaurants,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching restaurants',
    });
  }
};

/**
 * Get cuisine types
 * @route GET /api/search/cuisines
 * @access Public
 */
exports.getCuisineTypes = async (req, res) => {
  try {
    // Query to get all cuisine types from restaurants_by_cuisine table
    const query = 'SELECT DISTINCT cuisine_type FROM restaurants_by_cuisine';
    const result = await require('../config/database').client.execute(query, [], { prepare: true });
    
    const cuisineTypes = result.rows.map(row => row.cuisine_type);
    
    res.status(200).json({
      status: 'success',
      data: {
        cuisineTypes,
      },
    });
  } catch (error) {
    console.error('Error getting cuisine types:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting cuisine types',
    });
  }
};

/**
 * Get cities
 * @route GET /api/search/cities
 * @access Public
 */
exports.getCities = async (req, res) => {
  try {
    // Query to get all cities from restaurants_by_location table
    const query = 'SELECT DISTINCT city FROM restaurants_by_location';
    const result = await require('../config/database').client.execute(query, [], { prepare: true });
    
    const cities = result.rows.map(row => row.city);
    
    res.status(200).json({
      status: 'success',
      data: {
        cities,
      },
    });
  } catch (error) {
    console.error('Error getting cities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting cities',
    });
  }
}; 