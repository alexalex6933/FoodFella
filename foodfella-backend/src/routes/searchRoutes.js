const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Public routes
router.get('/', searchController.searchRestaurants);
router.get('/cuisines', searchController.getCuisineTypes);
router.get('/cities', searchController.getCities);

module.exports = router; 