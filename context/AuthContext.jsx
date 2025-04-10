import { createContext, useContext, useState } from 'react';
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: localStorage.getItem("authToken") !== null,
    userName: localStorage.getItem("userName"),
    userId: localStorage.getItem("userId")
  });

  const login = (token, userName, userId) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
    setAuthState({
      isAuthenticated: true,
      userName,
      userId
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setAuthState({
      isAuthenticated: false,
      userName: null,
      userId: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);