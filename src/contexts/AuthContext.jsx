import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';
import recipeService from '../services/recipeService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            await refreshToken();
          } else {
            await loadProfileAndFavorites();
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const loadProfileAndFavorites = async () => {
    try {
      const profileRes = await axiosInstance.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileRes.data);
      await fetchFavorites();
    } catch (err) {
      logout();
    }
  };

  const fetchFavorites = async () => {
    try {
      const favs = await recipeService.getFavorites();
      setFavorites(favs.map(r => r._id));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      setFavorites([]);
    }
  };

  const refreshToken = async () => {
    try {
      const { data } = await axiosInstance.get('/api/users/refresh', {
        withCredentials: true,
      });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      await loadProfileAndFavorites();
    } catch (err) {
      logout();
    }
  };

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setToken(userData.token);
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
    });
  };

  const logout = async () => {
    try {
      await axiosInstance.get('/api/users/logout', { withCredentials: true });
    } catch (err) {}
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setFavorites([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        favorites,
        setFavorites,
        refreshFavorites: fetchFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);