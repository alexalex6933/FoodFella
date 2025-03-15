const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Search restaurants by various criteria
router.get('/restaurants', searchController.searchRestaurants);

// Get all cuisine types
router.get('/cuisines', searchController.getAllCuisineTypes);

// Get all cities
router.get('/cities', searchController.getAllCities);

// Semantic search using vector capabilities
router.get('/semantic', searchController.semanticSearch);

module.exports = router; 