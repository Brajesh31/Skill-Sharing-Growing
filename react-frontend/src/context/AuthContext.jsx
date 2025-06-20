import React, { createContext, useState, useEffect, useMemo } from "react";
import { authService } from "../services/authService";
import PropTypes from 'prop-types'; 

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  login: async () => { },
  logout: async () => { },
  handleCallback: async () => false,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkLoginStatus = () => {
      const isLoggedIn = authService.isLoggedIn();
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = async () => {
    try {
      const authUrl = await authService.getAuthUrl();
      window.location.href = authUrl;
    } catch {
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch {
      setIsLoading(false);
    }
  };

  const handleCallback = async (code) => {
    try {
      setIsLoading(true);
      const tokenData = await authService.getToken(code);
      authService.setToken(tokenData);

      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    isAuthenticated,
    isLoading,
    login,
    logout,
    handleCallback,
  }), [isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};