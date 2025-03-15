const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/restaurant/:restaurantId', reviewController.getReviewsByRestaurantId);

// Protected routes
router.post('/', protect, reviewController.createReview);
router.get('/user', protect, reviewController.getUserReviews);
router.put('/:restaurantId/:reviewId', protect, reviewController.updateReview);
router.delete('/:restaurantId/:reviewId', protect, reviewController.deleteReview);

module.exports = router; 