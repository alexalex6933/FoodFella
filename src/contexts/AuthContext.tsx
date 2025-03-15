import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { register, login, getCurrentUser, updateProfile } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      setIsLoading(true);
      const response = await getCurrentUser(authToken);
      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user);
      } else {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
      setToken(null);
      setError('Session expired. Please login again.');
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await register({ name, email, password });
      
      if (response.status === 'success' && response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await login({ email, password });
      
      if (response.status === 'success' && response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!token) {
      setError('You must be logged in to update your profile');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await updateProfile(userData, token);
      
      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user);
      } else {
        setError(response.message || 'Profile update failed');
      }
    } catch (err: any) {
      setError(err.message || 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};