const request = require('supertest');
const app = require('../src/server');

describe('Authentication', () => {
  let token;
  let userId;
  const testEmail = `auth-test-${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  // Test user registration
  it('should register a new user', async () => {
    const userData = {
      email: testEmail,
      password: testPassword,
      firstName: 'Auth',
      lastName: 'Tester',
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
  
  // Test user login with valid credentials
  it('should login a user with valid credentials', async () => {
    const loginData = {
      email: testEmail,
      password: testPassword
    };
    
    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
  });
  
  // Test user login with invalid credentials
  it('should not login a user with invalid credentials', async () => {
    const loginData = {
      email: testEmail,
      password: 'wrongpassword'
    };
    
    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);
    
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('fail');
  });
  
  // Test protected route access with valid token
  it('should access protected route with valid token', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });
  
  // Test protected route access with invalid token
  it('should not access protected route with invalid token', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalidtoken');
    
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('fail');
  });
  
  // Test token verification
  it('should verify a valid token', async () => {
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.isValid).toBe(true);
  });
}); 