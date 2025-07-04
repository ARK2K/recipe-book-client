import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [recipe, setRecipe] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const fetchRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
      setIsFavorited(user?.favorites?.includes(id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch recipe');
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id, user]);

  const handleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(id);
      toast.success(res.message);

      const favorited = res.message.includes('added');
      setIsFavorited(favorited);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update favorites');
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <p className="text-sm mb-4">By {recipe.creatorName || 'Unknown'}</p>
      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover mb-4" />

      <h2 className="text-xl font-semibold mb-1">Ingredients:</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-1">Instructions:</h2>
      <p className="mb-4">{recipe.instructions}</p>

      {user && (
        <button
          onClick={handleFavorite}
          className="px-4 py-2 border rounded text-yellow-600 hover:bg-yellow-100 mb-4"
        >
          {isFavorited ? 'Unfavorite' : 'Add to Favorites'}
        </button>
      )}
    </div>
  );
};

export default RecipeDetailPage;