import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';

const RecipeCard = ({ recipe, onFavoritesUpdate }) => {
  const { user, favorites, setFavorites } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFavorited(favorites?.includes(recipe._id));
  }, [favorites, recipe._id]);

  const handleFavorite = async () => {
    if (!user) return toast.error('Login to favorite recipes');

    try {
      const { message, added } = await recipeService.toggleFavorite(recipe._id);
      toast.success(message);

      const updatedFavorites = added
        ? [...favorites, recipe._id]
        : favorites.filter(favId => favId !== recipe._id);

      setFavorites(updatedFavorites);
      setIsFavorited(added);

      if (onFavoritesUpdate) onFavoritesUpdate(updatedFavorites);
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="card shadow-sm mb-3 h-100 d-flex flex-column">
      <div className="w-100" style={{ flex: 1, overflow: 'hidden' }}>
        <img
          src={recipe.imageUrl || recipe.image}
          className="w-100"
          style={{ objectFit: 'cover', height: '100%' }}
          alt={recipe.title}
        />
      </div>

      <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 1 }}>
        <div>
          <h5 className="card-title">{recipe.title}</h5>
          <p className="card-text">By {recipe.creatorName || 'Unknown'}</p>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/recipes/${recipe._id}`)}>
            View
          </button>
          <button
            className={`btn btn-sm ${isFavorited ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={handleFavorite}
          >
            {isFavorited ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;