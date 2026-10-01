import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('auth_token'));
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail');
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [isAuthenticated, userEmail]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    api.auth.me()
      .then(({ user }) => {
        setUserEmail(user.email);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
        setUserEmail(null);
        setIsAuthenticated(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.auth.login({ email, password });
    localStorage.setItem('auth_token', response.token);
    setIsAuthenticated(true);
    setUserEmail(response.user.email);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const register = async (email: string, password: string) => {
    const response = await api.auth.register({ email, password });
    localStorage.setItem('auth_token', response.token);
    setIsAuthenticated(true);
    setUserEmail(response.user.email);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};