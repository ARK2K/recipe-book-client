import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import RecipeCard from '../components/RecipeCard';

const ProfilePage = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await axiosInstance.get('/api/recipes/my-recipes');
        setMyRecipes(res.data);
      } catch (err) {
        console.error('❌ Failed to load your recipes:', err);
        setError(err.response?.data?.message || 'Something went wrong');
      }
    };

    fetchMyRecipes();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Your Recipes</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {myRecipes.length > 0 ? (
          myRecipes.map((recipe) => (
            <div key={recipe._id} className="col-md-4">
              <RecipeCard recipe={recipe} />
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;