import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  const fetchRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
    } catch (err) {
      toast.error('Failed to load recipe');
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(id);
      toast.success(res.message);
      fetchRecipe();
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <p className="text-gray-500 mb-4">By {recipe.creatorName}</p>
      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover rounded mb-4" />
      <h2 className="font-semibold">Ingredients:</h2>
      <ul className="list-disc ml-5 mb-4">
        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
      <h2 className="font-semibold">Instructions:</h2>
      <p className="mb-4">{recipe.instructions}</p>
      <button onClick={handleToggleFavorite} className={`btn ${recipe.isFavorited ? 'bg-yellow-500' : 'bg-yellow-100'}`}>
        {recipe.isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
};

export default RecipeDetailPage;