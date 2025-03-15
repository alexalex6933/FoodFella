const Restaurant = require('../models/restaurantModel');
const searchService = require('../services/searchService');
const { v4: uuidv4 } = require('uuid');
const { getCollection } = require('../config/database');

/**
 * Get all restaurants with pagination
 * @route GET /api/restaurants
 * @access Public
 */
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await searchService.getAllRestaurants();
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurants
      }
    });
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting restaurants'
    });
  }
};

/**
 * Get a restaurant by ID
 * @route GET /api/restaurants/:id
 * @access Public
 */
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    const restaurantsCollection = await getCollection('restaurants');
    const restaurant = await restaurantsCollection.get(restaurantId);
    
    if (!restaurant || !restaurant.data) {
      return res.status(404).json({
        status: 'fail',
        message: 'Restaurant not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurant: restaurant.data
      }
    });
  } catch (error) {
    console.error('Error getting restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting restaurant'
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
    const { name, description, cuisineType, priceRange, locations, images } = req.body;
    
    if (!name || !description || !cuisineType) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, description, and cuisine type'
      });
    }
    
    const restaurantId = uuidv4();
    const now = new Date();
    
    // Create restaurant
    const restaurantsCollection = await getCollection('restaurants');
    
    const restaurant = {
      id: restaurantId,
      name,
      description,
      cuisine_type: cuisineType,
      price_range: priceRange || 'moderate',
      merchant_id: req.user.id,
      created_at: now,
      updated_at: now
    };
    
    await restaurantsCollection.create(restaurantId, restaurant);
    
    // Create restaurant location
    if (locations && locations.length > 0) {
      const locationCollection = await getCollection('restaurant_locations');
      const locationsByCity = await getCollection('restaurants_by_location');
      
      for (const location of locations) {
        const locationId = uuidv4();
        
        const locationData = {
          restaurant_id: restaurantId,
          location_id: locationId,
          address: location.street,
          city: location.city,
          state: location.state,
          zip_code: location.zipCode,
          latitude: location.latitude || null,
          longitude: location.longitude || null,
          created_at: now,
          updated_at: now
        };
        
        await locationCollection.create(`${restaurantId}_${locationId}`, locationData);
        
        // Add to restaurants_by_location for search
        const locationSearchData = {
          city: location.city,
          restaurant_id: restaurantId,
          name,
          cuisine_type: cuisineType,
          price_range: priceRange || 'moderate',
          created_at: now
        };
        
        await locationsByCity.create(`${location.city}_${restaurantId}`, locationSearchData);
      }
    }
    
    // Add to restaurants_by_cuisine for search
    const cuisineCollection = await getCollection('restaurants_by_cuisine');
    
    const cuisineData = {
      cuisine_type: cuisineType,
      restaurant_id: restaurantId,
      name,
      price_range: priceRange || 'moderate',
      created_at: now
    };
    
    await cuisineCollection.create(`${cuisineType}_${restaurantId}`, cuisineData);
    
    // Store vector embedding for restaurant description
    if (description) {
      try {
        await searchService.storeRestaurantVector(restaurantId, description);
      } catch (error) {
        console.error('Error storing vector embedding:', error);
        // Continue with response even if vector storage fails
      }
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        restaurant
      }
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating restaurant'
    });
  }
};

/**
 * Update a restaurant
 * @route PATCH /api/restaurants/:id
 * @access Private (Merchant only)
 */
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    // Get current restaurant data
    const restaurantsCollection = await getCollection('restaurants');
    const currentRestaurantResponse = await restaurantsCollection.get(restaurantId);
    
    if (!currentRestaurantResponse || !currentRestaurantResponse.data) {
      return res.status(404).json({
        status: 'fail',
        message: 'Restaurant not found'
      });
    }
    
    const currentRestaurant = currentRestaurantResponse.data;
    
    // Check if user is the owner
    if (currentRestaurant.merchant_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this restaurant'
      });
    }
    
    // Build update data
    const updateData = { updated_at: new Date() };
    
    if (req.body.name) {
      updateData.name = req.body.name;
    }
    
    if (req.body.description) {
      updateData.description = req.body.description;
    }
    
    if (req.body.cuisineType) {
      updateData.cuisine_type = req.body.cuisineType;
    }
    
    if (req.body.priceRange) {
      updateData.price_range = req.body.priceRange;
    }
    
    // Update restaurant
    await restaurantsCollection.update(restaurantId, updateData);
    
    // Update vector embedding if description changed
    if (req.body.description && req.body.description !== currentRestaurant.description) {
      try {
        await searchService.storeRestaurantVector(restaurantId, req.body.description);
      } catch (error) {
        console.error('Error updating vector embedding:', error);
        // Continue with response even if vector storage fails
      }
    }
    
    // Get the updated restaurant
    const updatedRestaurantResponse = await restaurantsCollection.get(restaurantId);
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurant: updatedRestaurantResponse.data
      }
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating restaurant'
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
    const restaurantId = req.params.id;
    
    // Get restaurant data
    const restaurantsCollection = await getCollection('restaurants');
    const restaurantResponse = await restaurantsCollection.get(restaurantId);
    
    if (!restaurantResponse || !restaurantResponse.data) {
      return res.status(404).json({
        status: 'fail',
        message: 'Restaurant not found'
      });
    }
    
    const restaurant = restaurantResponse.data;
    
    // Check if user is the owner
    if (restaurant.merchant_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to delete this restaurant'
      });
    }
    
    // Delete restaurant
    await restaurantsCollection.delete(restaurantId);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting restaurant'
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