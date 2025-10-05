
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginWithEmail, logout as firebaseLogout } from '../services/firebaseService';

interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for checking existing session on component mount
    // In a real app, this would check localStorage or a cookie
    const storedUser = sessionStorage.getItem('loyalfly_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const loggedInUser = await loginWithEmail(email, pass);
      setUser(loggedInUser);
      sessionStorage.setItem('loyalfly_user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
    sessionStorage.removeItem('loyalfly_user');
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
