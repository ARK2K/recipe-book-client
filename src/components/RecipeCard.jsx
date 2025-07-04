import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!token) return;
      try {
        const favorites = await recipeService.getFavorites();
        setIsFavorited(favorites.some(r => r._id === recipe._id));
      } catch (err) {
        console.error('Error checking favorites:', err);
      }
    };
    checkFavorite();
  }, [token, recipe._id]);

  const handleToggleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(recipe._id);
      toast.success(res.message);
      setIsFavorited(prev => !prev);
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="border rounded-xl p-3 shadow-sm flex flex-col gap-2">
      <img src={recipe.imageUrl} alt={recipe.title} className="h-32 object-cover rounded" />
      <h3 className="font-bold">{recipe.title}</h3>
      <p className="text-sm text-gray-500">By {recipe.creatorName}</p>
      <div className="flex gap-2">
        <button onClick={() => navigate(`/recipes/${recipe._id}`)} className="btn btn-primary">
          View
        </button>
        <button
          onClick={handleToggleFavorite}
          className={`btn ${isFavorited ? 'bg-yellow-500' : 'bg-yellow-100'}`}
        >
          {isFavorited ? 'Unfavorite' : 'Favorite'}
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;