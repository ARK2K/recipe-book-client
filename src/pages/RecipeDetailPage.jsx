import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user, favorites, setFavorites } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(id);
      setRecipe(data);
    } catch {
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (user) {
      setIsFavorite(favorites.includes(id));
    }
  }, [favorites, id, user]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText) return;

    try {
      await recipeService.submitComment(id, { comment: commentText, rating });
      toast.success('Comment added');
      setCommentText('');
      setRating(0);
      fetchRecipe();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleFavorite = async () => {
    try {
      await recipeService.toggleFavorite(id);
      const updatedFavorites = await recipeService.refreshFavorites();
      setFavorites(updatedFavorites.map(r => r._id));
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-2">{recipe.title}</h2>
      <div className="mb-3 text-muted">By: {recipe.creatorName || 'Unknown'}</div>
      <img
        src={recipe.imageUrl || recipe.image}
        alt={recipe.title}
        className="img-fluid mb-3"
      />
      <p>{recipe.description}</p>

      <h4>Ingredients</h4>
      <ul>
        {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
      </ul>

      <h4>Instructions</h4>
      <p>{recipe.instructions}</p>

      {user && (
        <button
          onClick={handleFavorite}
          className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} mb-3`}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />} {isFavorite ? 'Unfavorite' : 'Favorite'}
        </button>
      )}

      <hr />

      {user && (
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Leave a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="0">Select rating (optional)</option>
              {[1, 2, 3, 4, 5].map(r => (
                <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">Post Comment</button>
        </form>
      )}

      <h5>Comments</h5>
      {recipe.comments?.length > 0 ? (
        recipe.comments.map((c, idx) => (
          <div key={idx} className="card mb-2 p-2">
            <strong>{c.user?.name || 'User'}:</strong> {c.text}
            {c.stars > 0 && <div>Rating: {c.stars} ⭐</div>}
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
            </div>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default RecipeDetailPage;