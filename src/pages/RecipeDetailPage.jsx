import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, ListGroup, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError('Recipe not found or failed to load.');
        toast.error('Failed to load recipe.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeService.deleteRecipe(id);
        toast.success('Recipe deleted successfully!');
        navigate('/');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete recipe');
      }
    }
  };

  if (loading) return <Container>Loading recipe...</Container>;
  if (error) return <Container>Error: {error}</Container>;
  if (!recipe) return <Container>Recipe not found.</Container>;

  return (
    <Container className="my-4">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        Go Back
      </Button>
      <Card>
        {recipe.image && (
          <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
        )}
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          {recipe.creatorName && (
            <Card.Subtitle className="mb-2 text-muted">By {recipe.creatorName}</Card.Subtitle>
          )}
          <Card.Text>{recipe.description}</Card.Text>

          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Ingredients:</strong>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Instructions:</strong>
              <p>{recipe.instructions}</p>
            </ListGroup.Item>
            {recipe.category && (
              <ListGroup.Item>
                <strong>Category:</strong> {recipe.category}
              </ListGroup.Item>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <ListGroup.Item>
                <strong>Tags:</strong> {recipe.tags.join(', ')}
              </ListGroup.Item>
            )}
          </ListGroup>

          {user && recipe.user === user._id && (
            <div className="mt-3">
              <Button
                variant="info"
                onClick={() => navigate(`/recipes/${recipe._id}/edit`)}
                className="me-2"
              >
                Edit Recipe
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Recipe
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecipeDetailPage;