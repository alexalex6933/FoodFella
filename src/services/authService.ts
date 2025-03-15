import API_URL from '../config/api';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'restaurant_owner';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  token?: string;
  data?: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    }
  };
  message?: string;
}

// Register a new user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('Registering user with data:', userData);
    console.log('Sending request to:', `${API_URL}/api/users/register`);
    
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    console.log('Registration response:', data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login a user
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    console.log('Logging in with credentials:', { email: credentials.email, passwordLength: credentials.password.length });
    console.log('Sending request to:', `${API_URL}/api/users/login`);
    
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (token: string, userData: Partial<RegisterData>): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}; 