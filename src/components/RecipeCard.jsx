import { useState } from 'react';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';

const RecipeCard = ({ recipe, refreshData, isFavoriteList = false }) => {
  const [likes, setLikes] = useState(recipe.likes?.length || 0);
  const [liked, setLiked] = useState(recipe.likes?.includes?.(recipe.user?._id) || false);
  const [favorite, setFavorite] = useState(false);

  const handleLike = async () => {
    try {
      const res = await recipeService.toggleLike(recipe._id);
      setLikes(res.likes);
      setLiked(res.liked);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to like recipe');
    }
  };

  const handleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(recipe._id);
      setFavorite(res.message.includes('added'));
      if (isFavoriteList && res.message.includes('removed')) {
        refreshData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Favorite action failed');
    }
  };

  return (
    <div className="border shadow p-4 rounded space-y-2">
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="h-48 w-full object-cover rounded" />
      )}

      <h2 className="text-xl font-bold">{recipe.title}</h2>
      <p className="text-gray-600">{recipe.description}</p>

      <p className="text-sm text-gray-500">
        By {recipe.creatorName || 'Unknown'} | {new Date(recipe.createdAt).toLocaleDateString()}
      </p>

      <div className="flex gap-4 mt-2">
        <button onClick={handleLike} className={`px-3 py-1 border rounded ${liked ? 'bg-blue-100' : ''}`}>
          👍 {likes}
        </button>
        <button onClick={handleFavorite} className="px-3 py-1 border rounded">
          ⭐ {isFavoriteList || favorite ? 'Unfavorite' : 'Favorite'}
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;