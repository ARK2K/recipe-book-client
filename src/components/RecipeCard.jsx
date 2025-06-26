import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import recipeService from '../services/recipeService';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { user, favorites, setFavorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFavorite(favorites.includes(recipe._id));
    }
  }, [favorites, recipe._id, user]);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await recipeService.toggleFavorite(recipe._id);
      const updatedFavorites = await recipeService.refreshFavorites();
      setFavorites(updatedFavorites.map(r => r._id));
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div
      className="border rounded-lg shadow hover:shadow-lg overflow-hidden relative cursor-pointer transition"
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      {(recipe.imageUrl || recipe.image) ? (
        <img
          src={recipe.imageUrl || recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      {user && (
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 text-red-500 text-xl z-10"
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{recipe.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        <div className="text-xs text-gray-500 mt-2">By: {recipe.creatorName || 'Unknown'}</div>
      </div>
    </div>
  );
};

export default RecipeCard;