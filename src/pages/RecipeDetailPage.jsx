import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { Container, Spinner, Button, Form } from 'react-bootstrap';
import { toast } from 'sonner';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading, favorites, setFavorites } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const isFavorite = favorites.includes(id);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load recipe');
        navigate('/');
      } finally {
        setLoadingRecipe(false);
      }
    };

    if (user) {
      fetchRecipe();
    }
  }, [id, user, navigate]);

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

  const handleFavoriteToggle = async () => {
    try {
      await recipeService.toggleFavorite(id);
      const updatedFavorites = await recipeService.refreshFavorites();
      setFavorites(updatedFavorites.map(r => r._id));
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (err) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await recipeService.submitComment(id, { comment, rating });
      toast.success('Comment added!');
      setComment('');
      setRating(0);
      const updatedRecipe = await recipeService.getRecipeById(id);
      setRecipe(updatedRecipe);
    } catch (err) {
      toast.error('Failed to submit comment');
    }
  };

  if (loading || !user) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (loadingRecipe) {
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

      <div className="row">
        <div className="col-12 col-md-6">
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
        </div>

        <div className="col-12 col-md-6">
          {(recipe.imageUrl || recipe.image) && (
            <div className="mb-3 text-center">
              <img
                src={recipe.imageUrl || recipe.image}
                alt="Recipe"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <strong>Average Rating:</strong> {recipe.averageRating?.toFixed(1) || 0} ({recipe.numReviews || 0} reviews)
      </div>

      <div className="mb-3">
        <Button variant={isFavorite ? 'danger' : 'outline-danger'} onClick={handleFavoriteToggle}>
          {isFavorite ? 'Unfavorite' : 'Favorite'}
        </Button>
      </div>

      <Form onSubmit={handleCommentSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Your Rating:</Form.Label>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant={rating >= star ? 'warning' : 'outline-secondary'}
                size="sm"
                onClick={() => setRating(star)}
                className="me-1"
              >
                ★
              </Button>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Leave a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">Submit</Button>
      </Form>

      <div className="mt-4">
        <h5>Comments</h5>
        {recipe.comments && recipe.comments.length > 0 ? (
          recipe.comments.map((c, idx) => (
            <div key={idx} className="mb-2">
              <strong>{c.user?.name || 'Anonymous'}:</strong> {c.text} ({c.stars} ★)
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {user && recipe.creatorId === user._id && (
        <div className="mt-4">
          <Link to={`/edit/${recipe._id}`} className="btn btn-warning me-2">Edit</Link>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      )}
    </Container>
  );
};

export default RecipeDetailPage;