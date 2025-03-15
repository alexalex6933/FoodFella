const request = require('supertest');
const app = require('../src/server');

describe('Review API', () => {
  let userToken;
  let restaurantId;
  let reviewId;
  
  // Before running tests, register a user and create a restaurant
  beforeAll(async () => {
    // Register a user
    const userData = {
      email: `review-test-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Review',
      lastName: 'Tester',
      role: 'customer'
    };
    
    const userResponse = await request(app)
      .post('/api/users/register')
      .send(userData);
    
    userToken = userResponse.body.token;
    
    // Register a restaurant owner
    const ownerData = {
      email: `restaurant-owner-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Restaurant',
      lastName: 'Owner',
      role: 'restaurant_owner'
    };
    
    const ownerResponse = await request(app)
      .post('/api/users/register')
      .send(ownerData);
    
    const ownerToken = ownerResponse.body.token;
    
    // Create a restaurant
    const restaurantData = {
      name: `Test Restaurant for Reviews ${Date.now()}`,
      description: 'A test restaurant for review API testing',
      cuisineType: 'Italian',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      },
      contactInfo: {
        phone: '123-456-7890',
        email: 'test@restaurant.com',
        website: 'https://testrestaurant.com'
      }
    };
    
    const restaurantResponse = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(restaurantData);
    
    restaurantId = restaurantResponse.body.data.restaurant.id;
  });
  
  // Test creating a review
  it('should create a new review', async () => {
    const reviewData = {
      rating: 4,
      comment: 'This is a test review for the restaurant. The food was great!',
      visitDate: new Date().toISOString().split('T')[0]
    };
    
    const response = await request(app)
      .post(`/api/restaurants/${restaurantId}/reviews`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(reviewData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.review).toBeDefined();
    expect(response.body.data.review.rating).toBe(reviewData.rating);
    
    // Save review ID for later tests
    reviewId = response.body.data.review.id;
  });
  
  // Test getting all reviews for a restaurant
  it('should get all reviews for a restaurant', async () => {
    const response = await request(app)
      .get(`/api/restaurants/${restaurantId}/reviews`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.reviews)).toBe(true);
  });
  
  // Test updating a review
  it('should update a review', async () => {
    if (!reviewId) {
      throw new Error('Review ID not available. Create review test may have failed.');
    }
    
    const updateData = {
      rating: 5,
      comment: 'Updated review comment. The food was excellent!'
    };
    
    const response = await request(app)
      .patch(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.review).toBeDefined();
    expect(response.body.data.review.rating).toBe(updateData.rating);
    expect(response.body.data.review.comment).toBe(updateData.comment);
  });
  
  // Test deleting a review
  it('should delete a review', async () => {
    if (!reviewId) {
      throw new Error('Review ID not available. Create review test may have failed.');
    }
    
    const response = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(response.statusCode).toBe(204);
  });
}); 