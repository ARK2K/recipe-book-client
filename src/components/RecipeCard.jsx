import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, onFavoritesUpdate }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(recipe.favorites?.includes(user?._id));
  }, [recipe, user]);

  const handleFavorite = async () => {
    if (!user) return toast.error('Login to favorite recipes');
    try {
      setLoading(true);
      await recipeService.toggleFavorite(recipe._id);
      const favorites = await recipeService.getFavorites();
      setIsFavorite(favorites.some(r => r._id === recipe._id));
      onFavoritesUpdate(favorites);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
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
          <Link to={`/recipes/${recipe._id}`} className="btn btn-outline-primary btn-sm">View</Link>
          <button
            className={`btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={handleFavorite}
            disabled={loading}
          >
            {loading ? '...' : isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;