const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Merchant routes - must be defined before the /:id route to avoid conflicts
router.get('/merchant', protect, restrictTo('merchant'), restaurantController.getMerchantRestaurants);

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// Protected routes - Merchant only
router.post('/', protect, restrictTo('merchant'), restaurantController.createRestaurant);
router.put('/:id', protect, restrictTo('merchant'), restaurantController.updateRestaurant);
router.delete('/:id', protect, restrictTo('merchant'), restaurantController.deleteRestaurant);

module.exports = router; 