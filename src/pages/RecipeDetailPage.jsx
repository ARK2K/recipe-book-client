import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axiosInstance.get(`/recipe/${id}`);
        setRecipe(data);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Failed to fetch recipe');
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full max-w-md mb-4"
        />
      )}
      <p className="mb-2">
        <strong>Description:</strong> {recipe.description}
      </p>
      <p className="mb-2">
        <strong>Ingredients:</strong> {recipe.ingredients}
      </p>
      <p>
        <strong>Instructions:</strong> {recipe.instructions}
      </p>
    </div>
  );
};

export default RecipeDetailPage;