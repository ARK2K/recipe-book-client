import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';
import { useState } from 'react';

const RecipeCard = ({ recipe, refreshFavorites }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(
    recipe.favorites?.includes(user?._id)
  );

  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await recipeService.toggleFavorite(recipe._id);
      setIsFavorite((prev) => !prev);
      refreshFavorites && refreshFavorites();
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  return (
    <div
      className="card h-100 shadow-sm recipe-card"
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      style={{ cursor: 'pointer' }}
    >
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="card-img-top"
          style={{ objectFit: 'cover', height: '200px' }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{recipe.title}</h5>
        <p className="card-text text-muted mb-2">
          By {recipe.creatorName || 'Unknown'}
        </p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {recipe.averageRating?.toFixed(1) || 0} ⭐ ({recipe.numReviews})
          </small>
          {user && (
            <button
              className={`btn btn-sm ${isFavorite ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={handleFavorite}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;