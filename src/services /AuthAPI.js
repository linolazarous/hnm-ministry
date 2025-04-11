import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_AUTH_API_URL;

export const AuthAPI = {
  async login(email, password) {
    try {
      // In production, replace with actual API call
      // Mock implementation
      if (email === 'admin@heavenlynature.org' && password === 'securepassword123') {
        return {
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@heavenlynature.org',
            role: 'admin'
          },
          token: 'mock-jwt-token'
        };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      // Mock implementation - replace with actual API call
      if (token === 'mock-jwt-token') {
        return {
          id: 1,
          name: 'Admin User',
          email: 'admin@heavenlynature.org',
          role: 'admin'
        };
      }
      throw new Error('Invalid token');
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }
};