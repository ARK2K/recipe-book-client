import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddRecipePage from './pages/AddRecipePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import EditRecipePage from './pages/EditRecipePage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('🌍 API_BASE_URL =', API_BASE_URL);

function App() {
  const location = useLocation();

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/health`);
      } catch (error) {
        console.error('❌ Failed to wake backend:', error);
      }
    };
    wakeUpBackend();
  }, []);

  console.log('🧱 ToastContainer rendered');

  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer />
      <Header />
      <main className="py-3 flex-grow-1">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/recipes/new" element={<AddRecipePage />} />
              <Route path="/edit/:id" element={<EditRecipePage />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;