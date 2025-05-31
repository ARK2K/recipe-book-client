import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view recipe details');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    api.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => toast.error('Failed to load recipe'));
  }, [id, user, navigate]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="col-md-8 offset-md-2">
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      {/* Rest of recipe details */}
    </div>
  );
}

export default RecipeDetails;