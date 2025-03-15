const request = require('supertest');
const app = require('../src/server');

describe('Restaurant API', () => {
  let token;
  let restaurantId;
  
  // Before running tests, register a user and get token
  beforeAll(async () => {
    const userData = {
      email: `restaurant-test-${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Restaurant',
      lastName: 'Tester',
      role: 'restaurant_owner'
    };
    
    const response = await request(app)
      .post('/api/users/register')
      .send(userData);
    
    token = response.body.token;
  });
  
  // Test creating a restaurant
  it('should create a new restaurant', async () => {
    const restaurantData = {
      name: `Test Restaurant ${Date.now()}`,
      description: 'A test restaurant for API testing',
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
      },
      openingHours: {
        monday: '9:00 AM - 10:00 PM',
        tuesday: '9:00 AM - 10:00 PM',
        wednesday: '9:00 AM - 10:00 PM',
        thursday: '9:00 AM - 10:00 PM',
        friday: '9:00 AM - 11:00 PM',
        saturday: '10:00 AM - 11:00 PM',
        sunday: '10:00 AM - 9:00 PM'
      }
    };
    
    const response = await request(app)
      .post('/api/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send(restaurantData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.restaurant).toBeDefined();
    expect(response.body.data.restaurant.name).toBe(restaurantData.name);
    
    // Save restaurant ID for later tests
    restaurantId = response.body.data.restaurant.id;
  });
  
  // Test getting all restaurants
  it('should get all restaurants', async () => {
    const response = await request(app)
      .get('/api/restaurants');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.restaurants)).toBe(true);
  });
  
  // Test getting a specific restaurant
  it('should get a specific restaurant by ID', async () => {
    if (!restaurantId) {
      throw new Error('Restaurant ID not available. Create restaurant test may have failed.');
    }
    
    const response = await request(app)
      .get(`/api/restaurants/${restaurantId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.restaurant).toBeDefined();
    expect(response.body.data.restaurant.id).toBe(restaurantId);
  });
  
  // Test updating a restaurant
  it('should update a restaurant', async () => {
    if (!restaurantId) {
      throw new Error('Restaurant ID not available. Create restaurant test may have failed.');
    }
    
    const updateData = {
      name: `Updated Restaurant ${Date.now()}`,
      description: 'Updated description for testing'
    };
    
    const response = await request(app)
      .patch(`/api/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.restaurant).toBeDefined();
    expect(response.body.data.restaurant.name).toBe(updateData.name);
  });
}); 