import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Spinner, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load recipe');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await recipeService.deleteRecipe(id);
      toast.success('Recipe deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container className="mt-5 text-center">
        <p>Recipe not found.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>{recipe.title}</h1>
      <p><strong>By:</strong> {recipe.creatorName}</p>
      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Category:</strong> {recipe.category || 'N/A'}</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p><strong>Instructions:</strong></p>
      <p>{recipe.instructions}</p>

      {recipe.imageUrl && (
        <div className="mb-3">
          <img src={recipe.imageUrl} alt="Recipe" style={{ maxWidth: '100%', borderRadius: '8px' }} />
        </div>
      )}

      {user && recipe.creatorId === user._id && (
        <div className="mt-3">
          <Link to={`/edit/${recipe._id}`} className="btn btn-warning me-2">Edit</Link>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      )}
    </Container>
  );
};

export default RecipeDetailPage;