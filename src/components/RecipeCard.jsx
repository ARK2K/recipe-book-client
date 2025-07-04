import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, onFavoritesUpdate }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (user) {
        const favorites = await recipeService.getFavorites();
        setIsFavorite(favorites.includes(recipe._id));
      }
    };
    checkFavorite();
  }, [recipe, user]);

  const handleFavorite = async () => {
    if (!user) return toast.error('Login to favorite recipes');
    try {
      await recipeService.toggleFavorite(recipe._id);
      const updatedFavorites = await recipeService.getFavorites();
      setIsFavorite(updatedFavorites.includes(recipe._id));
      onFavoritesUpdate(updatedFavorites);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
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
          <Link to={`/recipes/${recipe._id}`} className="btn btn-outline-primary btn-sm">View</Link>
          <button
            className={`btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={handleFavorite}
          >
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;