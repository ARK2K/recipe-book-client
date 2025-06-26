import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Spinner, Button, Form } from 'react-bootstrap';
import { toast } from 'sonner';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading, setFavorites } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
        setFavorite(user ? data.favorites?.includes(user._id) : false);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to load recipe');
        navigate('/');
      } finally {
        setLoadingRecipe(false);
      }
    };

    if (!loading && id) {
      fetchRecipe();
    }
  }, [id, loading, user, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await recipeService.deleteRecipe(id);
      toast.success('Recipe deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete recipe');
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      await recipeService.toggleFavorite(id);
      setFavorite(!favorite);
      toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
      const updatedFavorites = await recipeService.refreshFavorites();
      setFavorites(updatedFavorites);
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await recipeService.submitComment(id, { comment, rating });
      toast.success('Comment added');
      setComment('');
      setRating(0);
      const updatedRecipe = await recipeService.getRecipeById(id);
      setRecipe(updatedRecipe);
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (loading || loadingRecipe) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container className="text-center mt-5">
        <h2>Recipe not found</h2>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>{recipe.title}</h1>
      <p><strong>By:</strong> {recipe.creatorName || 'Unknown'}</p>

      <div className="row">
        <div className="col-md-6">
          <p><strong>Description:</strong> {recipe.description}</p>
          <p><strong>Category:</strong> {recipe.category || 'N/A'}</p>
          <p><strong>Ingredients:</strong></p>
          <ul>
            {recipe.ingredients?.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p><strong>Instructions:</strong></p>
          <p>{recipe.instructions}</p>
        </div>

        <div className="col-md-6">
          {(recipe.imageUrl || recipe.image) ? (
            <img
              src={recipe.imageUrl || recipe.image}
              alt="Recipe"
              className="img-fluid mb-3"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div className="text-muted">No image available</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <strong>Average Rating:</strong> {recipe.averageRating?.toFixed(1) || 0} ({recipe.numReviews || 0} reviews)
      </div>

      {user && (
        <div className="mb-3">
          <Button variant={favorite ? 'danger' : 'outline-danger'} onClick={handleFavoriteToggle}>
            {favorite ? 'Unfavorite' : 'Favorite'}
          </Button>
        </div>
      )}

      {user && (
        <Form onSubmit={handleCommentSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Your Rating:</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map(star => (
                <Button
                  key={star}
                  variant={rating >= star ? 'warning' : 'outline-secondary'}
                  size="sm"
                  onClick={() => setRating(star)}
                  className="me-1"
                  type="button"
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

          <Button type="submit">Submit</Button>
        </Form>
      )}

      <div className="mt-4">
        <h5>Comments</h5>
        {recipe.comments?.length ? recipe.comments.map((c, idx) => (
          <div key={idx} className="mb-2">
            <strong>{c.user?.name || 'Anonymous'}:</strong> {c.comment} ({c.rating} ★)
          </div>
        )) : <p>No comments yet.</p>}
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