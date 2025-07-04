import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        toast.error('Failed to fetch recipe');
      }
    };

    const checkFavorite = async () => {
      if (!token) return;
      try {
        const favorites = await recipeService.getFavorites();
        setIsFavorited(favorites.some(r => r._id === id));
      } catch (err) {
        console.error('Error checking favorites:', err);
      }
    };

    fetchRecipe();
    checkFavorite();
  }, [id, token]);

  const handleToggleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(id);
      toast.success(res.message);
      setIsFavorited(prev => !prev);
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{recipe.title}</h2>
      <p className="text-gray-500">By {recipe.creatorName}</p>
      <img src={recipe.imageUrl} alt={recipe.title} className="my-4 max-h-96" />
      <h3 className="font-semibold">Ingredients:</h3>
      <ul className="list-disc list-inside">
        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
      <h3 className="font-semibold mt-4">Instructions:</h3>
      <p>{recipe.instructions}</p>

      <div className="mt-4">
        <button
          onClick={handleToggleFavorite}
          className={`btn ${isFavorited ? 'bg-yellow-500' : 'bg-yellow-100'}`}
        >
          {isFavorited ? 'Unfavorite' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailPage;