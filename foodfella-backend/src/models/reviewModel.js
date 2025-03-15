const { client } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Review {
  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @returns {Object} Created review
   */
  static async create(reviewData) {
    try {
      const reviewId = uuidv4();
      const now = new Date();
      
      const query = `
        INSERT INTO reviews (
          restaurant_id, user_id, review_id, rating, comment, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        reviewData.restaurantId,
        reviewData.userId,
        reviewId,
        reviewData.rating,
        reviewData.comment,
        now,
        now
      ];
      
      await client.execute(query, params, { prepare: true });
      
      return {
        restaurantId: reviewData.restaurantId,
        userId: reviewData.userId,
        reviewId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }
  
  /**
   * Find a review by ID
   * @param {string} restaurantId - Restaurant ID
   * @param {string} reviewId - Review ID
   * @returns {Object|null} Review object or null if not found
   */
  static async findById(restaurantId, reviewId) {
    try {
      const query = 'SELECT * FROM reviews WHERE restaurant_id = ? AND review_id = ?';
      const result = await client.execute(query, [restaurantId, reviewId], { prepare: true });
      
      if (result.rowLength === 0) {
        return null;
      }
      
      const review = result.first();
      
      return {
        restaurantId: review.restaurant_id,
        userId: review.user_id,
        reviewId: review.review_id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        updatedAt: review.updated_at
      };
    } catch (error) {
      console.error('Error finding review by ID:', error);
      throw error;
    }
  }
  
  /**
   * Find reviews by restaurant ID with pagination
   * @param {string} restaurantId - Restaurant ID
   * @param {number} page - Page number
   * @param {number} limit - Number of reviews per page
   * @returns {Object} Object with reviews array and pagination info
   */
  static async findByRestaurantId(restaurantId, page = 1, limit = 10) {
    try {
      const query = 'SELECT * FROM reviews WHERE restaurant_id = ?';
      const result = await client.execute(query, [restaurantId], { prepare: true });
      
      const totalReviews = result.rowLength;
      const totalPages = Math.ceil(totalReviews / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      const paginatedRows = result.rows.slice(startIndex, endIndex);
      
      const reviews = paginatedRows.map(review => ({
        restaurantId: review.restaurant_id,
        userId: review.user_id,
        reviewId: review.review_id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        updatedAt: review.updated_at
      }));
      
      return {
        reviews,
        pagination: {
          total: totalReviews,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error finding reviews by restaurant ID:', error);
      throw error;
    }
  }
  
  /**
   * Find reviews by user ID with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Number of reviews per page
   * @returns {Object} Object with reviews array and pagination info
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    try {
      const query = 'SELECT * FROM reviews WHERE user_id = ? ALLOW FILTERING';
      const result = await client.execute(query, [userId], { prepare: true });
      
      const totalReviews = result.rowLength;
      const totalPages = Math.ceil(totalReviews / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      const paginatedRows = result.rows.slice(startIndex, endIndex);
      
      const reviews = paginatedRows.map(review => ({
        restaurantId: review.restaurant_id,
        userId: review.user_id,
        reviewId: review.review_id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        updatedAt: review.updated_at
      }));
      
      return {
        reviews,
        pagination: {
          total: totalReviews,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error finding reviews by user ID:', error);
      throw error;
    }
  }
  
  /**
   * Update a review
   * @param {string} restaurantId - Restaurant ID
   * @param {string} reviewId - Review ID
   * @param {Object} reviewData - Review data to update
   * @returns {Object} Updated review
   */
  static async update(restaurantId, reviewId, reviewData) {
    try {
      const review = await this.findById(restaurantId, reviewId);
      
      if (!review) {
        throw new Error('Review not found');
      }
      
      const now = new Date();
      const updateFields = [];
      const params = [];
      
      if (reviewData.rating) {
        updateFields.push('rating = ?');
        params.push(reviewData.rating);
      }
      
      if (reviewData.comment) {
        updateFields.push('comment = ?');
        params.push(reviewData.comment);
      }
      
      updateFields.push('updated_at = ?');
      params.push(now);
      
      // Add IDs at the end for WHERE clause
      params.push(restaurantId);
      params.push(reviewId);
      
      const query = `
        UPDATE reviews
        SET ${updateFields.join(', ')}
        WHERE restaurant_id = ? AND review_id = ?
      `;
      
      await client.execute(query, params, { prepare: true });
      
      // Get updated review
      return await this.findById(restaurantId, reviewId);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }
  
  /**
   * Delete a review
   * @param {string} restaurantId - Restaurant ID
   * @param {string} reviewId - Review ID
   * @returns {boolean} True if deleted, false otherwise
   */
  static async delete(restaurantId, reviewId) {
    try {
      const query = 'DELETE FROM reviews WHERE restaurant_id = ? AND review_id = ?';
      await client.execute(query, [restaurantId, reviewId], { prepare: true });
      
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
  
  /**
   * Check if a user has already reviewed a restaurant
   * @param {string} restaurantId - Restaurant ID
   * @param {string} userId - User ID
   * @returns {boolean} True if user has already reviewed, false otherwise
   */
  static async hasUserReviewed(restaurantId, userId) {
    try {
      const query = 'SELECT * FROM reviews WHERE restaurant_id = ? AND user_id = ? ALLOW FILTERING';
      const result = await client.execute(query, [restaurantId, userId], { prepare: true });
      
      return result.rowLength > 0;
    } catch (error) {
      console.error('Error checking if user has reviewed:', error);
      throw error;
    }
  }
}

module.exports = Review; 