import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Loader from '../components/Loader';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/recipes/${id}`);
        setRecipe(data);
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <Loader />;
  if (!recipe) return <p className="text-danger">Recipe not found.</p>;

  return (
    <div>
      <h2>{recipe.title}</h2>
      {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="img-fluid my-3" />}
      <p><strong>Category:</strong> {recipe.category}</p>
      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients?.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>
      <p><strong>Instructions:</strong></p>
      <p>{recipe.instructions}</p>
      <p><strong>Created By:</strong> {recipe.creatorName}</p>
    </div>
  );
}

export default RecipeDetailPage;