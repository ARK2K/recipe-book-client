import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            await refreshToken();
          } else {
            setUser({ _id: decoded.id });
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [token]);

  const refreshToken = async () => {
    try {
      const { data } = await axiosInstance.get('/api/users/refresh', {
        withCredentials: true
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

  const logout = async () => {
    try {
      await axiosInstance.get('/api/users/logout', {
        withCredentials: true
      });
    } catch (err) {}
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);