import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';  
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import RecipeForm from './pages/RecipeForm';
import RecipeDetails from './pages/RecipeDetails';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/ping');
  }, []);

  return (
    <AuthProvider>
      <>
        <Header />
        <div className="container my-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/recipes/new" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
            <Route path="/recipes/edit/:id" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
            
            {/* Protect the recipe details route */}
            <Route path="/recipes/:id" element={
              <PrivateRoute>
                <RecipeDetails />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer />
      </>
    </AuthProvider>
  );
}

export default App;