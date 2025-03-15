import API_URL from '../config/api';

export interface RestaurantData {
  name: string;
  description: string;
  cuisineType: string;
  priceRange?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo?: {
    phone: string;
    email: string;
    website: string;
  };
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface RestaurantResponse {
  status: string;
  data?: {
    restaurant: {
      id: string;
      name: string;
      description: string;
      cuisine_type: string;
      price_range: string;
      merchant_id: string;
      created_at: string;
      updated_at: string;
    };
  };
  message?: string;
}

export interface RestaurantsResponse {
  status: string;
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
    }>;
  };
  message?: string;
}

// Get all restaurants
export const getAllRestaurants = async (): Promise<RestaurantsResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get restaurants error:', error);
    throw error;
  }
};

// Get restaurant by ID
export const getRestaurantById = async (id: string): Promise<RestaurantResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get restaurant error:', error);
    throw error;
  }
};

// Create a new restaurant
export const createRestaurant = async (token: string, restaurantData: RestaurantData): Promise<RestaurantResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create restaurant error:', error);
    throw error;
  }
};

// Update a restaurant
export const updateRestaurant = async (token: string, id: string, restaurantData: Partial<RestaurantData>): Promise<RestaurantResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/restaurants/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update restaurant error:', error);
    throw error;
  }
};

// Delete a restaurant
export const deleteRestaurant = async (token: string, id: string): Promise<void> => {
  try {
    await fetch(`${API_URL}/api/restaurants/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    throw error;
  }
}; 