import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true); // Waits during token check/refresh

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
          console.error('Token error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [token]);

  const refreshToken = async () => {
    try {
      const { data } = await axiosInstance.get('/auth/refresh'); // Sends cookie
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser({ _id: jwtDecode(data.token).id });
    } catch (err) {
      console.error('Refresh failed:', err);
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
    axiosInstance.get('/auth/logout');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);