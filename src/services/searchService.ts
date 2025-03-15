import API_URL from '../config/api';

export interface SearchResponse {
  status: string;
  results?: number;
  data?: {
    restaurants: Array<{
      id: string;
      name: string;
      description: string;
      cuisine_type: string;
      price_range: string;
      merchant_id: string;
      created_at: string;
      updated_at: string;
      similarity?: number;
    }>;
  };
  message?: string;
}

// Search restaurants by name
export const searchRestaurantsByName = async (name: string): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/search/restaurants?name=${encodeURIComponent(name)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search restaurants by name error:', error);
    throw error;
  }
};

// Search restaurants by cuisine
export const searchRestaurantsByCuisine = async (cuisine: string): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/search/restaurants?cuisine=${encodeURIComponent(cuisine)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search restaurants by cuisine error:', error);
    throw error;
  }
};

// Search restaurants by location
export const searchRestaurantsByLocation = async (city: string): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/search/restaurants?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search restaurants by location error:', error);
    throw error;
  }
};

// Semantic search for restaurants
export const semanticSearch = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/search/semantic?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Semantic search error:', error);
    throw error;
  }
};

// Get all cuisine types
export const getAllCuisineTypes = async (): Promise<{ status: string; data?: { cuisines: string[] }; message?: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/search/cuisines`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get cuisine types error:', error);
    throw error;
  }
};

// Get all cities
export const getAllCities = async (): Promise<{ status: string; data?: { cities: string[] }; message?: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/search/cities`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get cities error:', error);
    throw error;
  }
}; 