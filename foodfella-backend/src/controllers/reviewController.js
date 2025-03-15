const Review = require('../models/reviewModel');
const Restaurant = require('../models/restaurantModel');

/**
 * Create a new review
 * @route POST /api/reviews
 * @access Private
 */
exports.createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found',
      });
    }
    
    // Check if user has already reviewed this restaurant
    const hasReviewed = await Review.hasUserReviewed(restaurantId, req.user.id);
    
    if (hasReviewed) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this restaurant',
      });
    }
    
    // Create review
    const review = await Review.create({
      restaurantId,
      userId: req.user.id,
      rating,
      comment,
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating review',
    });
  }
};

/**
 * Get reviews by restaurant ID
 * @route GET /api/reviews/restaurant/:restaurantId
 * @access Public
 */
exports.getReviewsByRestaurantId = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Review.findByRestaurantId(
      req.params.restaurantId,
      page,
      limit
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        reviews: result.reviews,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting reviews',
    });
  }
};

/**
 * Get reviews by user ID
 * @route GET /api/reviews/user
 * @access Private
 */
exports.getUserReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Review.findByUserId(req.user.id, page, limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        reviews: result.reviews,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    console.error('Error getting user reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting user reviews',
    });
  }
};

/**
 * Update a review
 * @route PUT /api/reviews/:restaurantId/:reviewId
 * @access Private
 */
exports.updateReview = async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const { rating, comment } = req.body;
    
    // Check if review exists
    const review = await Review.findById(restaurantId, reviewId);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found',
      });
    }
    
    // Check if the review belongs to the authenticated user
    if (review.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this review',
      });
    }
    
    // Update review
    const updatedReview = await Review.update(restaurantId, reviewId, {
      rating,
      comment,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        review: updatedReview,
      },
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating review',
    });
  }
};

/**
 * Delete a review
 * @route DELETE /api/reviews/:restaurantId/:reviewId
 * @access Private
 */
exports.deleteReview = async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;
    
    // Check if review exists
    const review = await Review.findById(restaurantId, reviewId);
    
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found',
      });
    }
    
    // Check if the review belongs to the authenticated user
    if (review.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this review',
      });
    }
    
    // Delete review
    await Review.delete(restaurantId, reviewId);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting review',
    });
  }
}; 