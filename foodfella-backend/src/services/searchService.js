const { client } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Get all restaurants
const getAllRestaurants = async () => {
  const query = 'SELECT * FROM restaurants';
  const result = await client.execute(query);
  return result.rows;
};

// Search restaurants by name
const searchRestaurantsByName = async (name) => {
  const query = 'SELECT * FROM restaurants WHERE name CONTAINS ?';
  const result = await client.execute(query, [name], { prepare: true });
  return result.rows;
};

// Search restaurants by cuisine
const searchRestaurantsByCuisine = async (cuisine) => {
  const query = 'SELECT * FROM restaurants_by_cuisine WHERE cuisine_type = ?';
  const result = await client.execute(query, [cuisine], { prepare: true });
  
  // Get full restaurant details for each result
  const restaurants = [];
  for (const row of result.rows) {
    const restaurantQuery = 'SELECT * FROM restaurants WHERE id = ?';
    const restaurantResult = await client.execute(restaurantQuery, [row.restaurant_id], { prepare: true });
    if (restaurantResult.rows.length > 0) {
      restaurants.push(restaurantResult.rows[0]);
    }
  }
  
  return restaurants;
};

// Search restaurants by location
const searchRestaurantsByLocation = async (city) => {
  const query = 'SELECT * FROM restaurants_by_location WHERE city = ?';
  const result = await client.execute(query, [city], { prepare: true });
  
  // Get full restaurant details for each result
  const restaurants = [];
  for (const row of result.rows) {
    const restaurantQuery = 'SELECT * FROM restaurants WHERE id = ?';
    const restaurantResult = await client.execute(restaurantQuery, [row.restaurant_id], { prepare: true });
    if (restaurantResult.rows.length > 0) {
      restaurants.push(restaurantResult.rows[0]);
    }
  }
  
  return restaurants;
};

// Get all cuisine types
const getAllCuisineTypes = async () => {
  const query = 'SELECT DISTINCT cuisine_type FROM restaurants_by_cuisine';
  const result = await client.execute(query);
  return result.rows.map(row => row.cuisine_type);
};

// Get all cities
const getAllCities = async () => {
  const query = 'SELECT DISTINCT city FROM restaurants_by_location';
  const result = await client.execute(query);
  return result.rows.map(row => row.city);
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
    
    const query = `
      INSERT INTO restaurant_vectors (
        id, restaurant_id, description_vector, created_at
      ) VALUES (?, ?, ?, ?)
    `;
    
    await client.execute(
      query, 
      [id, restaurantId, embedding, new Date()], 
      { prepare: true }
    );
    
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
    const query = `
      SELECT restaurant_id, description_vector <=> ? AS similarity 
      FROM restaurant_vectors 
      ORDER BY description_vector <=> ? ASC 
      LIMIT ?
    `;
    
    const result = await client.execute(
      query, 
      [searchEmbedding, searchEmbedding, limit], 
      { prepare: true }
    );
    
    // Get full restaurant details for each result
    const restaurants = [];
    for (const row of result.rows) {
      const restaurantQuery = 'SELECT * FROM restaurants WHERE id = ?';
      const restaurantResult = await client.execute(
        restaurantQuery, 
        [row.restaurant_id], 
        { prepare: true }
      );
      
      if (restaurantResult.rows.length > 0) {
        const restaurant = restaurantResult.rows[0];
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