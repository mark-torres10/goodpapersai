import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  checkAuth: async () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

// API URL
const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Error verifying authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect to Google OAuth login
  const login = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 