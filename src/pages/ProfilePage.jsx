import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import RecipeCard from '../components/RecipeCard';

const ProfilePage = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await axiosInstance.get('/api/recipes/my-recipes');
        setMyRecipes(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Your Recipes</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : myRecipes.length > 0 ? (
        <div className="row">
          {myRecipes.map((recipe) => (
            <div key={recipe._id} className="col-md-4">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default ProfilePage;