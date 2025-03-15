const { getCollection } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Get all restaurants
const getAllRestaurants = async () => {
  try {
    const collection = await getCollection('restaurants');
    const restaurants = await collection.find({}).toArray();
    return restaurants;
  } catch (error) {
    console.error('Error getting all restaurants:', error);
    throw error;
  }
};

// Search restaurants by name
const searchRestaurantsByName = async (name) => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const restaurants = await restaurantsCollection.find({ 
      name: { $regex: name, $options: 'i' } 
    }).toArray();
    return restaurants;
  } catch (error) {
    console.error('Error searching restaurants by name:', error);
    throw error;
  }
};

// Search restaurants by cuisine
const searchRestaurantsByCuisine = async (cuisine) => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const restaurants = await restaurantsCollection.find({ 
      cuisine_type: cuisine 
    }).toArray();
    return restaurants;
  } catch (error) {
    console.error('Error searching restaurants by cuisine:', error);
    throw error;
  }
};

// Search restaurants by location
const searchRestaurantsByLocation = async (city) => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const restaurants = await restaurantsCollection.find({
      'address.city': city
    }).toArray();
    return restaurants;
  } catch (error) {
    console.error('Error searching restaurants by location:', error);
    throw error;
  }
};

// Get all cuisine types
const getAllCuisineTypes = async () => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const cuisines = await restaurantsCollection.distinct('cuisine_type');
    return cuisines;
  } catch (error) {
    console.error('Error getting all cuisine types:', error);
    throw error;
  }
};

// Get all cities
const getAllCities = async () => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const cities = await restaurantsCollection.distinct('address.city');
    return cities;
  } catch (error) {
    console.error('Error getting all cities:', error);
    throw error;
  }
};

// Semantic search for restaurants
const semanticSearch = async (query) => {
  try {
    // Get all restaurants
    const restaurantsCollection = await getCollection('restaurants');
    const restaurants = await restaurantsCollection.find({}).toArray();
    
    // Calculate similarity scores
    const results = restaurants.map(restaurant => {
      const nameScore = calculateSimilarity(query, restaurant.name);
      const descriptionScore = calculateSimilarity(query, restaurant.description);
      const cuisineScore = calculateSimilarity(query, restaurant.cuisine_type);
      
      // Weighted average of scores
      const similarity = (nameScore * 0.5) + (descriptionScore * 0.3) + (cuisineScore * 0.2);
      
      return {
        ...restaurant,
        similarity
      };
    });
    
    // Sort by similarity score (descending)
    results.sort((a, b) => b.similarity - a.similarity);
    
    // Filter out low-scoring results
    const threshold = 0.1;
    return results.filter(result => result.similarity > threshold);
  } catch (error) {
    console.error('Error performing semantic search:', error);
    throw error;
  }
};

// Calculate cosine similarity between two strings
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  // Convert strings to lowercase and split into words
  const words1 = str1.toLowerCase().split(/\W+/);
  const words2 = str2.toLowerCase().split(/\W+/);
  
  // Create a set of all unique words
  const uniqueWords = new Set([...words1, ...words2]);
  
  // Create vectors
  const vector1 = Array.from(uniqueWords).map(word => words1.filter(w => w === word).length);
  const vector2 = Array.from(uniqueWords).map(word => words2.filter(w => w === word).length);
  
  // Calculate dot product
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    mag1 += vector1[i] * vector1[i];
    mag2 += vector2[i] * vector2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  return dotProduct / (mag1 * mag2);
};

// Get restaurant by ID
const getRestaurantById = async (id) => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const restaurant = await restaurantsCollection.findOne({ id });
    return restaurant;
  } catch (error) {
    console.error('Error getting restaurant by ID:', error);
    throw error;
  }
};

// Create a new restaurant
const createRestaurant = async (restaurantData, userId) => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const newRestaurant = {
      id: uuidv4(),
      ...restaurantData,
      merchant_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await restaurantsCollection.insertOne(newRestaurant);
    return newRestaurant;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

// Update a restaurant
const updateRestaurant = async (id, restaurantData, userId) => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const restaurant = await restaurantsCollection.findOne({ id });
    
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    if (restaurant.merchant_id !== userId) {
      throw new Error('Unauthorized to update this restaurant');
    }
    
    const updatedRestaurant = {
      ...restaurant,
      ...restaurantData,
      updated_at: new Date().toISOString()
    };
    
    await restaurantsCollection.updateOne({ id }, { $set: updatedRestaurant });
    return updatedRestaurant;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

// Delete a restaurant
const deleteRestaurant = async (id, userId) => {
  try {
    const restaurantsCollection = await getCollection('restaurants');
    const restaurant = await restaurantsCollection.findOne({ id });
    
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    if (restaurant.merchant_id !== userId) {
      throw new Error('Unauthorized to delete this restaurant');
    }
    
    await restaurantsCollection.deleteOne({ id });
    return { success: true };
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};

module.exports = {
  getAllRestaurants,
  searchRestaurantsByName,
  searchRestaurantsByCuisine,
  searchRestaurantsByLocation,
  getAllCuisineTypes,
  getAllCities,
  semanticSearch,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}; 