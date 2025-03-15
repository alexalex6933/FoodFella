const { client } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Restaurant {
  /**
   * Create a new restaurant
   * @param {Object} restaurantData - Restaurant data
   * @returns {Object} Created restaurant
   */
  static async create(restaurantData) {
    try {
      const id = uuidv4();
      const now = new Date();
      
      // Insert into restaurants table
      const query = `
        INSERT INTO restaurants (
          id, name, description, cuisine_type, price_range, merchant_id, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        id,
        restaurantData.name,
        restaurantData.description,
        restaurantData.cuisineType,
        restaurantData.priceRange,
        restaurantData.merchantId,
        now,
        now
      ];
      
      await client.execute(query, params, { prepare: true });
      
      // Insert into restaurants_by_cuisine table for search
      const cuisineQuery = `
        INSERT INTO restaurants_by_cuisine (
          cuisine_type, restaurant_id, name, price_range, created_at
        )
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const cuisineParams = [
        restaurantData.cuisineType,
        id,
        restaurantData.name,
        restaurantData.priceRange,
        now
      ];
      
      await client.execute(cuisineQuery, cuisineParams, { prepare: true });
      
      // Handle locations if provided
      if (restaurantData.locations && restaurantData.locations.length > 0) {
        await this.addLocations(id, restaurantData.locations);
      }
      
      // Handle images if provided
      if (restaurantData.images && restaurantData.images.length > 0) {
        await this.addImages(id, restaurantData.images);
      }
      
      // Return created restaurant
      return {
        id,
        name: restaurantData.name,
        description: restaurantData.description,
        cuisineType: restaurantData.cuisineType,
        priceRange: restaurantData.priceRange,
        merchantId: restaurantData.merchantId,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  }
  
  /**
   * Add locations to a restaurant
   * @param {string} restaurantId - Restaurant ID
   * @param {Array} locations - Array of location objects
   * @returns {Array} Added locations
   */
  static async addLocations(restaurantId, locations) {
    try {
      const now = new Date();
      const addedLocations = [];
      
      for (const location of locations) {
        const locationId = uuidv4();
        
        const query = `
          INSERT INTO restaurant_locations (
            restaurant_id, location_id, address, city, state, zip_code, 
            latitude, longitude, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
          restaurantId,
          locationId,
          location.address,
          location.city,
          location.state,
          location.zipCode,
          location.latitude || null,
          location.longitude || null,
          now,
          now
        ];
        
        await client.execute(query, params, { prepare: true });
        
        // Insert into restaurants_by_location table for search
        const locationQuery = `
          INSERT INTO restaurants_by_location (
            city, restaurant_id, name, cuisine_type, price_range, created_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        // Get restaurant details
        const restaurant = await this.findById(restaurantId);
        
        const locationParams = [
          location.city,
          restaurantId,
          restaurant.name,
          restaurant.cuisineType,
          restaurant.priceRange,
          now
        ];
        
        await client.execute(locationQuery, locationParams, { prepare: true });
        
        addedLocations.push({
          restaurantId,
          locationId,
          address: location.address,
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
          latitude: location.latitude || null,
          longitude: location.longitude || null,
          createdAt: now,
          updatedAt: now
        });
      }
      
      return addedLocations;
    } catch (error) {
      console.error('Error adding locations:', error);
      throw error;
    }
  }
  
  /**
   * Add images to a restaurant
   * @param {string} restaurantId - Restaurant ID
   * @param {Array} images - Array of image objects
   * @returns {Array} Added images
   */
  static async addImages(restaurantId, images) {
    try {
      const now = new Date();
      const addedImages = [];
      
      for (const image of images) {
        const imageId = uuidv4();
        
        const query = `
          INSERT INTO restaurant_images (
            restaurant_id, image_id, image_url, is_primary, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
          restaurantId,
          imageId,
          image.imageUrl,
          image.isPrimary || false,
          now,
          now
        ];
        
        await client.execute(query, params, { prepare: true });
        
        addedImages.push({
          restaurantId,
          imageId,
          imageUrl: image.imageUrl,
          isPrimary: image.isPrimary || false,
          createdAt: now,
          updatedAt: now
        });
      }
      
      return addedImages;
    } catch (error) {
      console.error('Error adding images:', error);
      throw error;
    }
  }
  
  /**
   * Find a restaurant by ID
   * @param {string} id - Restaurant ID
   * @returns {Object|null} Restaurant object or null if not found
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM restaurants WHERE id = ?';
      const result = await client.execute(query, [id], { prepare: true });
      
      if (result.rowLength === 0) {
        return null;
      }
      
      const restaurant = result.first();
      
      // Get locations
      const locations = await this.getLocations(id);
      
      // Get images
      const images = await this.getImages(id);
      
      // Get average rating
      const rating = await this.getAverageRating(id);
      
      return {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        cuisineType: restaurant.cuisine_type,
        priceRange: restaurant.price_range,
        merchantId: restaurant.merchant_id,
        locations,
        images,
        rating,
        createdAt: restaurant.created_at,
        updatedAt: restaurant.updated_at
      };
    } catch (error) {
      console.error('Error finding restaurant by ID:', error);
      throw error;
    }
  }
  
  /**
   * Get locations for a restaurant
   * @param {string} restaurantId - Restaurant ID
   * @returns {Array} Array of location objects
   */
  static async getLocations(restaurantId) {
    try {
      const query = 'SELECT * FROM restaurant_locations WHERE restaurant_id = ?';
      const result = await client.execute(query, [restaurantId], { prepare: true });
      
      return result.rows.map(location => ({
        restaurantId: location.restaurant_id,
        locationId: location.location_id,
        address: location.address,
        city: location.city,
        state: location.state,
        zipCode: location.zip_code,
        latitude: location.latitude,
        longitude: location.longitude,
        createdAt: location.created_at,
        updatedAt: location.updated_at
      }));
    } catch (error) {
      console.error('Error getting locations:', error);
      throw error;
    }
  }
  
  /**
   * Get images for a restaurant
   * @param {string} restaurantId - Restaurant ID
   * @returns {Array} Array of image objects
   */
  static async getImages(restaurantId) {
    try {
      const query = 'SELECT * FROM restaurant_images WHERE restaurant_id = ?';
      const result = await client.execute(query, [restaurantId], { prepare: true });
      
      return result.rows.map(image => ({
        restaurantId: image.restaurant_id,
        imageId: image.image_id,
        imageUrl: image.image_url,
        isPrimary: image.is_primary,
        createdAt: image.created_at,
        updatedAt: image.updated_at
      }));
    } catch (error) {
      console.error('Error getting images:', error);
      throw error;
    }
  }
  
  /**
   * Get average rating for a restaurant
   * @param {string} restaurantId - Restaurant ID
   * @returns {number} Average rating
   */
  static async getAverageRating(restaurantId) {
    try {
      const query = 'SELECT rating FROM reviews WHERE restaurant_id = ?';
      const result = await client.execute(query, [restaurantId], { prepare: true });
      
      if (result.rowLength === 0) {
        return 0;
      }
      
      const ratings = result.rows.map(row => row.rating);
      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      
      return parseFloat(average.toFixed(1));
    } catch (error) {
      console.error('Error getting average rating:', error);
      throw error;
    }
  }
  
  /**
   * Find restaurants by merchant ID
   * @param {string} merchantId - Merchant ID
   * @returns {Array} Array of restaurant objects
   */
  static async findByMerchantId(merchantId) {
    try {
      const query = 'SELECT * FROM restaurants WHERE merchant_id = ? ALLOW FILTERING';
      const result = await client.execute(query, [merchantId], { prepare: true });
      
      const restaurants = [];
      
      for (const row of result.rows) {
        const restaurant = await this.findById(row.id);
        restaurants.push(restaurant);
      }
      
      return restaurants;
    } catch (error) {
      console.error('Error finding restaurants by merchant ID:', error);
      throw error;
    }
  }
  
  /**
   * Update a restaurant
   * @param {string} id - Restaurant ID
   * @param {Object} restaurantData - Restaurant data to update
   * @returns {Object} Updated restaurant
   */
  static async update(id, restaurantData) {
    try {
      const restaurant = await this.findById(id);
      
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      const now = new Date();
      const updateFields = [];
      const params = [];
      
      if (restaurantData.name) {
        updateFields.push('name = ?');
        params.push(restaurantData.name);
      }
      
      if (restaurantData.description) {
        updateFields.push('description = ?');
        params.push(restaurantData.description);
      }
      
      if (restaurantData.cuisineType) {
        updateFields.push('cuisine_type = ?');
        params.push(restaurantData.cuisineType);
      }
      
      if (restaurantData.priceRange) {
        updateFields.push('price_range = ?');
        params.push(restaurantData.priceRange);
      }
      
      updateFields.push('updated_at = ?');
      params.push(now);
      
      // Add ID at the end for WHERE clause
      params.push(id);
      
      const query = `
        UPDATE restaurants
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;
      
      await client.execute(query, params, { prepare: true });
      
      // Update in restaurants_by_cuisine if cuisine type changed
      if (restaurantData.cuisineType && restaurantData.cuisineType !== restaurant.cuisineType) {
        // Delete from old cuisine type
        await client.execute(
          'DELETE FROM restaurants_by_cuisine WHERE cuisine_type = ? AND restaurant_id = ?',
          [restaurant.cuisineType, id],
          { prepare: true }
        );
        
        // Insert into new cuisine type
        const cuisineQuery = `
          INSERT INTO restaurants_by_cuisine (
            cuisine_type, restaurant_id, name, price_range, created_at
          )
          VALUES (?, ?, ?, ?, ?)
        `;
        
        const cuisineParams = [
          restaurantData.cuisineType,
          id,
          restaurantData.name || restaurant.name,
          restaurantData.priceRange || restaurant.priceRange,
          now
        ];
        
        await client.execute(cuisineQuery, cuisineParams, { prepare: true });
      }
      
      // Handle locations if provided
      if (restaurantData.locations && restaurantData.locations.length > 0) {
        // Delete existing locations
        await client.execute(
          'DELETE FROM restaurant_locations WHERE restaurant_id = ?',
          [id],
          { prepare: true }
        );
        
        // Add new locations
        await this.addLocations(id, restaurantData.locations);
      }
      
      // Handle images if provided
      if (restaurantData.images && restaurantData.images.length > 0) {
        // Delete existing images
        await client.execute(
          'DELETE FROM restaurant_images WHERE restaurant_id = ?',
          [id],
          { prepare: true }
        );
        
        // Add new images
        await this.addImages(id, restaurantData.images);
      }
      
      // Get updated restaurant
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  }
  
  /**
   * Delete a restaurant
   * @param {string} id - Restaurant ID
   * @returns {boolean} True if deleted, false otherwise
   */
  static async delete(id) {
    try {
      const restaurant = await this.findById(id);
      
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      // Delete from restaurants table
      await client.execute('DELETE FROM restaurants WHERE id = ?', [id], { prepare: true });
      
      // Delete from restaurants_by_cuisine table
      await client.execute(
        'DELETE FROM restaurants_by_cuisine WHERE cuisine_type = ? AND restaurant_id = ?',
        [restaurant.cuisineType, id],
        { prepare: true }
      );
      
      // Delete from restaurants_by_location table for each location
      for (const location of restaurant.locations) {
        await client.execute(
          'DELETE FROM restaurants_by_location WHERE city = ? AND restaurant_id = ?',
          [location.city, id],
          { prepare: true }
        );
      }
      
      // Delete from restaurant_locations table
      await client.execute(
        'DELETE FROM restaurant_locations WHERE restaurant_id = ?',
        [id],
        { prepare: true }
      );
      
      // Delete from restaurant_images table
      await client.execute(
        'DELETE FROM restaurant_images WHERE restaurant_id = ?',
        [id],
        { prepare: true }
      );
      
      // Delete from reviews table
      await client.execute(
        'DELETE FROM reviews WHERE restaurant_id = ?',
        [id],
        { prepare: true }
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  }
  
  /**
   * Find all restaurants with pagination
   * @param {number} page - Page number
   * @param {number} limit - Number of restaurants per page
   * @returns {Object} Object with restaurants array and pagination info
   */
  static async findAll(page = 1, limit = 10) {
    try {
      const query = 'SELECT * FROM restaurants';
      const result = await client.execute(query, [], { prepare: true });
      
      const totalRestaurants = result.rowLength;
      const totalPages = Math.ceil(totalRestaurants / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      const paginatedRows = result.rows.slice(startIndex, endIndex);
      const restaurants = [];
      
      for (const row of paginatedRows) {
        const restaurant = await this.findById(row.id);
        restaurants.push(restaurant);
      }
      
      return {
        restaurants,
        pagination: {
          total: totalRestaurants,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error finding all restaurants:', error);
      throw error;
    }
  }
  
  /**
   * Search restaurants by criteria
   * @param {Object} criteria - Search criteria
   * @param {number} page - Page number
   * @param {number} limit - Number of restaurants per page
   * @returns {Object} Object with restaurants array and pagination info
   */
  static async search(criteria, page = 1, limit = 10) {
    try {
      let query;
      let params = [];
      let result;
      
      // Search by cuisine type
      if (criteria.cuisineType) {
        query = 'SELECT * FROM restaurants_by_cuisine WHERE cuisine_type = ?';
        params = [criteria.cuisineType];
        result = await client.execute(query, params, { prepare: true });
      }
      // Search by location (city)
      else if (criteria.city) {
        query = 'SELECT * FROM restaurants_by_location WHERE city = ?';
        params = [criteria.city];
        result = await client.execute(query, params, { prepare: true });
      }
      // Search by price range (need to filter after fetching)
      else if (criteria.priceRange) {
        query = 'SELECT * FROM restaurants';
        result = await client.execute(query, [], { prepare: true });
        
        // Filter by price range
        result.rows = result.rows.filter(row => row.price_range === criteria.priceRange);
      }
      // Default to all restaurants
      else {
        query = 'SELECT * FROM restaurants';
        result = await client.execute(query, [], { prepare: true });
      }
      
      const totalRestaurants = result.rowLength;
      const totalPages = Math.ceil(totalRestaurants / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      const paginatedRows = result.rows.slice(startIndex, endIndex);
      const restaurants = [];
      
      for (const row of paginatedRows) {
        // For cuisine and location searches, we need to get the restaurant ID
        const restaurantId = row.restaurant_id || row.id;
        const restaurant = await this.findById(restaurantId);
        
        // Apply rating filter if specified
        if (criteria.minRating && restaurant.rating < criteria.minRating) {
          continue;
        }
        
        restaurants.push(restaurant);
      }
      
      return {
        restaurants,
        pagination: {
          total: totalRestaurants,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  }
}

module.exports = Restaurant; 