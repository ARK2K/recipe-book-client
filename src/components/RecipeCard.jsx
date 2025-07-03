import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { useState } from 'react';
import { toast } from 'sonner';

const RecipeCard = ({ recipe, refresh }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite);

  const handleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(recipe._id);
      setIsFavorite(!isFavorite);
      if (refresh) refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle favorite');
    }
  };

  return (
    <div className="card h-100 d-flex flex-column justify-content-between">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{recipe.title}</h5>
        <p className="card-text">{recipe.description}</p>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center">
        <Link to={`/recipes/${recipe._id}`} className="btn btn-sm btn-outline-primary">
          View
        </Link>
        {user && (
          <button
            className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={handleFavorite}
          >
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;