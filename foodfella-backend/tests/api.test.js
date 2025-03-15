const request = require('supertest');
const app = require('../src/server');

describe('API Health Check', () => {
  it('should return 200 OK for health check endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('User API', () => {
  let token;
  let userId;
  
  // Test user registration
  it('should register a new user', async () => {
    const userData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'customer'
    };
    
    const response = await request(app)
      .post('/api/users/register')
      .send(userData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.email).toBe(userData.email.toLowerCase());
    
    // Save token and user ID for later tests
    token = response.body.token;
    userId = response.body.data.user.id;
  });
  
  // Test user login
  it('should login a user', async () => {
    const loginData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    // First register the user
    await request(app)
      .post('/api/users/register')
      .send({
        ...loginData,
        firstName: 'Login',
        lastName: 'Test',
        role: 'customer'
      });
    
    // Then try to login
    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
  });
  
  // Test get user profile
  it('should get user profile with valid token', async () => {
    if (!token) {
      throw new Error('Token not available. Registration test may have failed.');
    }
    
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user).toBeDefined();
  });
});

// Note: These tests require a running Cassandra instance
// To run only the health check test, use:
// npm test -- -t "API Health Check" 