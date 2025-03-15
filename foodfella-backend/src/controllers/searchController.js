const searchService = require('../services/searchService');

/**
 * Search restaurants by various criteria
 * @route GET /api/search
 * @access Public
 */
exports.searchRestaurants = async (req, res) => {
  try {
    const { name, cuisine, city, query } = req.query;
    let restaurants = [];
    
    // If semantic search query is provided, use vector search
    if (query) {
      restaurants = await searchService.searchRestaurantsBySimilarity(query);
    }
    // Otherwise use traditional search methods
    else if (name) {
      restaurants = await searchService.searchRestaurantsByName(name);
    } else if (cuisine) {
      restaurants = await searchService.searchRestaurantsByCuisine(cuisine);
    } else if (city) {
      restaurants = await searchService.searchRestaurantsByLocation(city);
    } else {
      // If no criteria provided, return all restaurants
      restaurants = await searchService.getAllRestaurants();
    }
    
    res.status(200).json({
      status: 'success',
      results: restaurants.length,
      data: {
        restaurants
      }
    });
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching restaurants'
    });
  }
};

/**
 * Get all cuisine types
 * @route GET /api/search/cuisines
 * @access Public
 */
exports.getAllCuisineTypes = async (req, res) => {
  try {
    const cuisines = await searchService.getAllCuisineTypes();
    
    res.status(200).json({
      status: 'success',
      data: {
        cuisines
      }
    });
  } catch (error) {
    console.error('Error getting cuisine types:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting cuisine types'
    });
  }
};

/**
 * Get all cities
 * @route GET /api/search/cities
 * @access Public
 */
exports.getAllCities = async (req, res) => {
  try {
    const cities = await searchService.getAllCities();
    
    res.status(200).json({
      status: 'success',
      data: {
        cities
      }
    });
  } catch (error) {
    console.error('Error getting cities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting cities'
    });
  }
};

/**
 * Semantic search for restaurants
 * @route GET /api/search/semantic
 * @access Public
 */
exports.semanticSearch = async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'fail',
        message: 'Search query is required'
      });
    }
    
    const restaurants = await searchService.searchRestaurantsBySimilarity(
      query,
      limit ? parseInt(limit, 10) : 10
    );
    
    res.status(200).json({
      status: 'success',
      results: restaurants.length,
      data: {
        restaurants
      }
    });
  } catch (error) {
    console.error('Error performing semantic search:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error performing semantic search'
    });
  }
}; 