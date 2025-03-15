import API_URL from '../config/api';

export interface ReviewData {
  restaurant_id: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  status: string;
  data?: {
    review: {
      id: string;
      user_id: string;
      restaurant_id: string;
      rating: number;
      comment: string;
      created_at: string;
      updated_at: string;
    }
  };
  message?: string;
}

export interface ReviewsResponse {
  status: string;
  results?: number;
  data?: {
    reviews: Array<{
      id: string;
      user_id: string;
      restaurant_id: string;
      rating: number;
      comment: string;
      created_at: string;
      updated_at: string;
      user?: {
        id: string;
        name: string;
      }
    }>
  };
  message?: string;
}

// Get reviews for a restaurant
export const getRestaurantReviews = async (restaurantId: string): Promise<ReviewsResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/restaurant/${restaurantId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get restaurant reviews error:', error);
    throw error;
  }
};

// Get reviews by a user
export const getUserReviews = async (token: string): Promise<ReviewsResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get user reviews error:', error);
    throw error;
  }
};

// Create a review
export const createReview = async (reviewData: ReviewData, token: string): Promise<ReviewResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId: string, reviewData: Partial<ReviewData>, token: string): Promise<ReviewResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update review error:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string, token: string): Promise<{ status: string; message?: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
}; 