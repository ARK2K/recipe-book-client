import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (user && recipe?.favorites?.includes(user._id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [recipe, user]);

  const fetchRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
    } catch {
      toast.error('Failed to load recipe');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment) return;
    try {
      await recipeService.submitComment(id, { comment, rating });
      toast.success('Comment added');
      setComment('');
      setRating(0);
      fetchRecipe();
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(id);
      setIsFavorite((prev) => !prev);
      fetchRecipe();
      toast.success(!isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to toggle favorite');
    }
  };

  if (!recipe) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{recipe.title}</h2>
      <p className="text-muted">By {recipe.creatorName || 'Unknown'}</p>
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="img-fluid mb-3"
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      )}
      <p>{recipe.description}</p>

      <h5>Ingredients:</h5>
      <ul>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      <h5>Instructions:</h5>
      <p>{recipe.instructions}</p>

      <div className="d-flex align-items-center mb-3">
        <span className="me-3">⭐️ {recipe.averageRating?.toFixed(1) || 0}</span>
        {user && (
          <button className="btn btn-sm" onClick={handleToggleFavorite}>
            {isFavorite ? '❤️ Remove Favorite' : '🤍 Add to Favorites'}
          </button>
        )}
      </div>

      {user && (
        <form onSubmit={handleComment} className="mb-4">
          <h5>Leave a Comment</h5>
          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="me-2">Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`btn btn-sm ${rating >= star ? 'btn-warning' : 'btn-outline-secondary'} me-1`}
                onClick={() => setRating(star)}
              >
                ⭐️
              </button>
            ))}
          </div>
          <button className="btn btn-primary">Post Comment</button>
        </form>
      )}

      <h5>Comments:</h5>
      {recipe.comments?.length ? (
        recipe.comments.map((c) => (
          <div key={c._id} className="border rounded p-2 mb-2">
            <div className="d-flex justify-content-between">
              <strong>{c.user?.name || 'Anonymous'}</strong>
              <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
            </div>
            <div>{c.stars ? '⭐️'.repeat(c.stars) : ''}</div>
            <p className="mb-0">{c.text}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default RecipeDetailPage;