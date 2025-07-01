import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { loading: authLoading } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      console.log('Fetching recipe with ID:', id);

      try {
        const { data } = await axiosInstance.get(`/api/recipes/${id}`);
        console.log('Recipe data received:', data);
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  if (loading || authLoading) return <Loader />;

  if (!recipe) return (
    <div className="text-center mt-4 bg-red-100 p-4 border border-red-500">
      <p className="text-red-700 font-bold">Recipe not found.</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 bg-yellow-100 text-black border-4 border-blue-500">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <p className="text-gray-800 mb-4">By {recipe.creatorName || recipe.user?.name}</p>

      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="w-full h-auto mb-4 rounded border-2 border-green-500" />
      )}

      <h2 className="text-xl font-semibold mb-2">Description</h2>
      <p className="mb-4">{recipe.description}</p>

      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="list-disc list-inside mb-4 bg-green-100 p-2">
        {recipe.ingredients?.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      <p className="mb-4">{recipe.instructions}</p>

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      {recipe.comments?.length ? (
        <ul className="space-y-2 bg-pink-100 p-2">
          {recipe.comments.map((c) => (
            <li key={c._id} className="border p-2 rounded bg-white">
              <p><strong>{c.user?.name || 'Anonymous'}</strong> ({c.stars}★)</p>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="bg-gray-200 p-2">No comments yet.</p>
      )}
    </div>
  );
};

export default RecipeDetailPage;