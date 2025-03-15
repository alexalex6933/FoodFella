const request = require('supertest');
const app = require('../src/server');

describe('Search API', () => {
  // Test searching restaurants by name
  it('should search restaurants by name', async () => {
    const response = await request(app)
      .get('/api/search/restaurants')
      .query({ name: 'Test' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.restaurants)).toBe(true);
  });
  
  // Test searching restaurants by cuisine
  it('should search restaurants by cuisine', async () => {
    const response = await request(app)
      .get('/api/search/restaurants')
      .query({ cuisine: 'Italian' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.restaurants)).toBe(true);
  });
  
  // Test searching restaurants by location
  it('should search restaurants by location', async () => {
    const response = await request(app)
      .get('/api/search/restaurants')
      .query({ city: 'Test City' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.restaurants)).toBe(true);
  });
  
  // Test getting all cuisine types
  it('should get all cuisine types', async () => {
    const response = await request(app)
      .get('/api/search/cuisines');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.cuisines)).toBe(true);
  });
  
  // Test getting all cities
  it('should get all cities', async () => {
    const response = await request(app)
      .get('/api/search/cities');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.cities)).toBe(true);
  });
}); 