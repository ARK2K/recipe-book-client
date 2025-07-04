import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';

const RecipeCard = ({ recipe, onFavoritesUpdate }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(user?.favorites?.includes(recipe._id));

  const handleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(recipe._id);
      toast.success(res.message);

      // Backend returns "Recipe added to favorites" or "Recipe removed from favorites"
      const favorited = res.message.includes('added');
      setIsFavorited(favorited);

      if (onFavoritesUpdate) onFavoritesUpdate();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="border rounded shadow-md p-4 w-64 flex flex-col items-center justify-between">
      <img src={recipe.imageUrl} alt={recipe.title} className="h-32 w-full object-cover mb-2" />
      <h2 className="text-lg font-semibold">{recipe.title}</h2>
      <p className="text-sm mb-2">By {recipe.creatorName || 'Unknown'}</p>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/recipes/${recipe._id}`)}
          className="px-3 py-1 border rounded text-blue-500 hover:bg-blue-100"
        >
          View
        </button>
        {user && (
          <button
            onClick={handleFavorite}
            className="px-3 py-1 border rounded text-yellow-600 hover:bg-yellow-100"
          >
            {isFavorited ? 'Unfavorite' : 'Favorite'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;