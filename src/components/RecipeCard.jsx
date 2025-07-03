import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const RecipeCard = ({ recipe, favorites, refreshFavorites }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (favorites?.some(fav => fav._id === recipe._id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favorites, recipe._id]);

  const handleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(recipe._id);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      refreshFavorites();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update favorites');
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} className="card-img-top" alt={recipe.title} />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{recipe.title}</h5>
        <p className="card-text small text-muted">By {recipe.creatorName || 'Unknown'}</p>
        <p className="card-text">{recipe.description}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Link to={`/recipes/${recipe._id}`} className="btn btn-primary btn-sm">
            View Recipe
          </Link>
          {user && (
            <button
              className={`btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={handleFavorite}
            >
              {isFavorite ? '★ Favorite' : '☆ Favorite'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;