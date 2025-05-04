import { createContext, useState, useEffect, useCallback } from 'react';
import { magic } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create context with default values
export const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  getToken: async () => null,
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const navigate = useNavigate();

  // Check auth status on mount
  const checkAuthStatus = useCallback(async () => {
    try {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        const userData = await magic.user.getMetadata();
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      toast.error('Failed to check authentication status');
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login handler
  const login = async (email, redirectPath = '/') => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await magic.auth.loginWithMagicLink({ 
        email,
        showUI: true,
        redirectURI: new URL('/callback', window.location.origin).href
      });
      
      const userData = await magic.user.getMetadata();
      setAuthState({
        user: userData,
        isLoading: false,
        isAuthenticated: true,
      });
      
      toast.success(`Welcome back, ${userData.email}!`);
      navigate(redirectPath);
    } catch (err) {
      console.error('Login failed:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error('Login failed. Please try again.');
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await magic.user.logout();
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      toast.info('You have been logged out');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error('Logout failed. Please try again.');
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await magic.user.getMetadata();
      setAuthState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: !!userData,
      }));
      return userData;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  };

  // Get auth token
  const getToken = async () => {
    try {
      return await magic.user.getIdToken();
    } catch (err) {
      console.error('Failed to get token:', err);
      return null;
    }
  };

  // Value provided to context consumers
  const contextValue = {
    ...authState,
    login,
    logout,
    refreshUser,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy context consumption
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
