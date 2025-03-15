const Restaurant = require('../models/restaurantModel');
const searchService = require('../services/searchService');
const { v4: uuidv4 } = require('uuid');
const { client } = require('../database/database');

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
    
    const restaurantId = uuidv4();
    const now = new Date();
    
    // Create restaurant
    const query = `
      INSERT INTO restaurants (
        id, name, description, cuisine_type, price_range, merchant_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await client.execute(
      query,
      [
        restaurantId,
        name,
        description,
        cuisineType,
        priceRange || 'moderate',
        merchantId,
        now,
        now
      ],
      { prepare: true }
    );
    
    // Create restaurant location
    if (locations && locations.length > 0) {
      for (const location of locations) {
        const locationId = uuidv4();
        const locationQuery = `
          INSERT INTO restaurant_locations (
            restaurant_id, location_id, address, city, state, zip_code, latitude, longitude, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        await client.execute(
          locationQuery,
          [
            restaurantId,
            locationId,
            location.street,
            location.city,
            location.state,
            location.zip_code,
            location.latitude || null,
            location.longitude || null,
            now,
            now
          ],
          { prepare: true }
        );
        
        // Add to restaurants_by_location for search
        const locationSearchQuery = `
          INSERT INTO restaurants_by_location (
            city, restaurant_id, name, cuisine_type, price_range, created_at
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await client.execute(
          locationSearchQuery,
          [
            location.city,
            restaurantId,
            name,
            cuisineType,
            priceRange || 'moderate',
            now
          ],
          { prepare: true }
        );
      }
    }
    
    // Add to restaurants_by_cuisine for search
    const cuisineSearchQuery = `
      INSERT INTO restaurants_by_cuisine (
        cuisine_type, restaurant_id, name, price_range, created_at
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    await client.execute(
      cuisineSearchQuery,
      [
        cuisineType,
        restaurantId,
        name,
        priceRange || 'moderate',
        now
      ],
      { prepare: true }
    );
    
    // Store vector embedding for restaurant description
    if (description) {
      try {
        await searchService.storeRestaurantVector(restaurantId, description);
      } catch (error) {
        console.error('Error storing vector embedding:', error);
        // Continue with response even if vector storage fails
      }
    }
    
    // Get the created restaurant
    const getQuery = 'SELECT * FROM restaurants WHERE id = ?';
    const result = await client.execute(getQuery, [restaurantId], { prepare: true });
    
    res.status(201).json({
      status: 'success',
      data: {
        restaurant: result.rows[0]
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
 * @route PUT /api/restaurants/:id
 * @access Private (Merchant only)
 */
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const now = new Date();
    
    // Get current restaurant data
    const getQuery = 'SELECT * FROM restaurants WHERE id = ?';
    const currentResult = await client.execute(getQuery, [restaurantId], { prepare: true });
    
    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Restaurant not found'
      });
    }
    
    const currentRestaurant = currentResult.rows[0];
    
    // Check if user is the owner
    if (currentRestaurant.merchant_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this restaurant'
      });
    }
    
    // Build update query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];
    
    if (req.body.name) {
      updateFields.push('name = ?');
      updateValues.push(req.body.name);
    }
    
    if (req.body.description) {
      updateFields.push('description = ?');
      updateValues.push(req.body.description);
    }
    
    if (req.body.cuisine_type) {
      updateFields.push('cuisine_type = ?');
      updateValues.push(req.body.cuisine_type);
    }
    
    if (req.body.price_range) {
      updateFields.push('price_range = ?');
      updateValues.push(req.body.price_range);
    }
    
    updateFields.push('updated_at = ?');
    updateValues.push(now);
    
    // Add restaurant ID at the end for WHERE clause
    updateValues.push(restaurantId);
    
    // Update restaurant
    const updateQuery = `UPDATE restaurants SET ${updateFields.join(', ')} WHERE id = ?`;
    await client.execute(updateQuery, updateValues, { prepare: true });
    
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
    const result = await client.execute(getQuery, [restaurantId], { prepare: true });
    
    res.status(200).json({
      status: 'success',
      data: {
        restaurant: result.rows[0]
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