import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ _id: decoded.id });

        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) refreshToken();
      } catch (err) {
        console.error('Token error:', err);
        logout();
      }
    }
  }, [token]);

  const refreshToken = async () => {
    try {
      const { data } = await axiosInstance.get('/api/auth/refresh', {
        withCredentials: true,
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser({ _id: jwtDecode(data.token).id });
    } catch (err) {
      logout();
    }
  };

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setToken(userData.token);
    setUser({ _id: userData._id, name: userData.name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    axiosInstance.get('/api/auth/logout', { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);