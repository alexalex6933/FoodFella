const { getCollection } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Get all restaurants
const getAllRestaurants = async () => {
  const restaurantsCollection = await getCollection('restaurants');
  const response = await restaurantsCollection.find({});
  return response.data || [];
};

// Search restaurants by name
const searchRestaurantsByName = async (name) => {
  const restaurantsCollection = await getCollection('restaurants');
  const response = await restaurantsCollection.find({ name: { $regex: name } });
  return response.data || [];
};

// Search restaurants by cuisine
const searchRestaurantsByCuisine = async (cuisine) => {
  const cuisineCollection = await getCollection('restaurants_by_cuisine');
  const response = await cuisineCollection.find({ cuisine_type: cuisine });
  
  // Get full restaurant details for each result
  const restaurants = [];
  if (response.data && response.data.length > 0) {
    const restaurantsCollection = await getCollection('restaurants');
    
    for (const row of response.data) {
      const restaurantResponse = await restaurantsCollection.get(row.restaurant_id);
      if (restaurantResponse && restaurantResponse.data) {
        restaurants.push(restaurantResponse.data);
      }
    }
  }
  
  return restaurants;
};

// Search restaurants by location
const searchRestaurantsByLocation = async (city) => {
  const locationCollection = await getCollection('restaurants_by_location');
  const response = await locationCollection.find({ city: city });
  
  // Get full restaurant details for each result
  const restaurants = [];
  if (response.data && response.data.length > 0) {
    const restaurantsCollection = await getCollection('restaurants');
    
    for (const row of response.data) {
      const restaurantResponse = await restaurantsCollection.get(row.restaurant_id);
      if (restaurantResponse && restaurantResponse.data) {
        restaurants.push(restaurantResponse.data);
      }
    }
  }
  
  return restaurants;
};

// Get all cuisine types
const getAllCuisineTypes = async () => {
  const cuisineCollection = await getCollection('restaurants_by_cuisine');
  const response = await cuisineCollection.find({}, { fields: ['cuisine_type'] });
  
  // Extract unique cuisine types
  const cuisineTypes = new Set();
  if (response.data && response.data.length > 0) {
    response.data.forEach(row => cuisineTypes.add(row.cuisine_type));
  }
  
  return Array.from(cuisineTypes);
};

// Get all cities
const getAllCities = async () => {
  const locationCollection = await getCollection('restaurants_by_location');
  const response = await locationCollection.find({}, { fields: ['city'] });
  
  // Extract unique cities
  const cities = new Set();
  if (response.data && response.data.length > 0) {
    response.data.forEach(row => cities.add(row.city));
  }
  
  return Array.from(cities);
};

// Generate embeddings for text using OpenAI API
const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-ada-002'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

// Store restaurant description vector
const storeRestaurantVector = async (restaurantId, description) => {
  try {
    const embedding = await generateEmbedding(description);
    const id = uuidv4();
    
    const vectorCollection = await getCollection('restaurant_vectors');
    
    await vectorCollection.create(id, {
      id,
      restaurant_id: restaurantId,
      description_vector: embedding,
      created_at: new Date()
    });
    
    return id;
  } catch (error) {
    console.error('Error storing restaurant vector:', error);
    throw error;
  }
};

// Search restaurants by semantic similarity
const searchRestaurantsBySimilarity = async (searchText, limit = 10) => {
  try {
    // Generate embedding for search text
    const searchEmbedding = await generateEmbedding(searchText);
    
    // Perform ANN search
    // Note: This is a simplified approach as Astra REST API doesn't directly support vector search
    // In a production environment, you would use the Astra vector search capabilities
    const vectorCollection = await getCollection('restaurant_vectors');
    const response = await vectorCollection.find({});
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Calculate similarity manually (not efficient, but works for demo)
    const results = response.data.map(row => {
      const similarity = calculateCosineSimilarity(searchEmbedding, row.description_vector);
      return {
        restaurant_id: row.restaurant_id,
        similarity
      };
    });
    
    // Sort by similarity and take top results
    results.sort((a, b) => a.similarity - b.similarity);
    const topResults = results.slice(0, limit);
    
    // Get full restaurant details
    const restaurants = [];
    const restaurantsCollection = await getCollection('restaurants');
    
    for (const row of topResults) {
      const restaurantResponse = await restaurantsCollection.get(row.restaurant_id);
      if (restaurantResponse && restaurantResponse.data) {
        const restaurant = restaurantResponse.data;
        restaurant.similarity = row.similarity;
        restaurants.push(restaurant);
      }
    }
    
    return restaurants;
  } catch (error) {
    console.error('Error searching restaurants by similarity:', error);
    throw error;
  }
};

// Helper function to calculate cosine similarity
const calculateCosineSimilarity = (vec1, vec2) => {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  return dotProduct / (mag1 * mag2);
};

module.exports = {
  getAllRestaurants,
  searchRestaurantsByName,
  searchRestaurantsByCuisine,
  searchRestaurantsByLocation,
  getAllCuisineTypes,
  getAllCities,
  storeRestaurantVector,
  searchRestaurantsBySimilarity
}; 