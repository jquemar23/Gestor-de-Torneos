import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface User {
  email: string;
  // In a real app, password would be hashed and stored securely
  // For this mock, we don't store the password after registration
}

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password?: string) => void; // password optional for mock flexibility
  logout: () => void;
  register: (email: string, password?: string) => void; // password optional for mock flexibility
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user storage
const getMockUsers = (): User[] => {
  const usersStr = localStorage.getItem('mockUsers');
  return usersStr ? JSON.parse(usersStr) : [];
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
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

  const login = (email: string, _password?: string) => {
    // In a real app, you'd verify credentials against stored users
    // For this mock, any login attempt for a "known" (can be any) email is successful
    // Or if we want to be slightly more strict, check if user exists in mockUsers
    // const users = getMockUsers();
    // if (!users.find(u => u.email === email) && users.length > 0) { // Allow first ever login to pass
    //   throw new Error("Usuario no encontrado o contraseña incorrecta.");
    // }
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const register = (email: string, _password?: string) => {
    const users = getMockUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('Este correo electrónico ya está registrado.');
    }
    // Add new user (without storing password in this mock)
    users.push({ email });
    saveMockUsers(users);
    
    // Automatically log in after registration
    login(email);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};