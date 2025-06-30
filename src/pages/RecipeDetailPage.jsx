import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/recipes/${id}`);
        setRecipe(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <Loader />;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!recipe) return <p className="text-center">Recipe not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <p className="mb-4">{recipe.description}</p>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="w-full mb-4" />
      )}
      <h2 className="text-xl font-semibold mb-2">Ingredients:</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
      <p className="mb-4">{recipe.instructions}</p>

      <h2 className="text-xl font-semibold mb-2">Comments:</h2>
      {recipe.comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        recipe.comments.map((comment) => (
          <div key={comment._id} className="border-b py-2">
            <p>
              <strong>{comment.user?.name || "User"}</strong>: {comment.text} -{" "}
              {comment.stars}⭐
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default RecipeDetailPage;