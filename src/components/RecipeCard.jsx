import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorited || false);

  const handleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(recipe._id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="border rounded-xl shadow p-3 flex flex-col gap-3">
      <img
        src={recipe.imageUrl || recipe.image || '/placeholder.png'}
        alt={recipe.title}
        className="h-40 w-full object-cover rounded-xl"
      />
      <h2 className="text-lg font-semibold">{recipe.title}</h2>
      <p className="text-sm text-gray-500">By {recipe.creatorName || 'Unknown'}</p>
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(`/recipes/${recipe._id}`)} className="btn btn-primary">
          View
        </button>
        {user && (
          <button
            onClick={handleFavorite}
            className={`btn ${isFavorite ? 'btn-danger' : 'btn-warning'}`}
          >
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;