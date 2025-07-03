import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const RecipeCard = ({ recipe, onFavoriteChange }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user && recipe.favorites?.includes(user._id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [recipe.favorites, user]);

  const handleToggleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(recipe._id);
      setIsFavorite((prev) => !prev);
      if (onFavoriteChange) onFavoriteChange();
      toast.success(!isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to toggle favorite');
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{recipe.title}</h5>
        <p className="card-text small text-muted">
          By {recipe.creatorName || 'Unknown'} | {recipe.averageRating?.toFixed(1) || 0} ⭐️
        </p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Link to={`/recipes/${recipe._id}`} className="btn btn-sm btn-outline-primary">
            View Details
          </Link>
          {user && (
            <button className="btn btn-sm" onClick={handleToggleFavorite}>
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;