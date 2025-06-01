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

function App() {
  const location = useLocation();
  console.log('Current path:', location.pathname);
  return (
    <>
      <Header />
      <main className="py-3">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Private Routes - only accessible if authenticated */}
            <Route path="/profile" element={<PrivateRoute element={ProfilePage} />} />
            <Route path="/recipes/new" element={<PrivateRoute element={AddRecipePage} />} />
            <Route path="/recipes/:id/edit" element={<PrivateRoute element={EditRecipePage} />} />

            {/* Public Routes for recipes */}
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;