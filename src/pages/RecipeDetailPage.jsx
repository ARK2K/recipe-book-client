import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRecipe = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/recipes/${id}`);
      setRecipe(data);
    } catch (err) {
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!commentText) return;

    try {
      await axiosInstance.post(`/api/recipes/${id}/comment`, {
        comment: commentText,
        rating
      });
      toast.success('Comment added');
      setCommentText('');
      setRating(0);
      fetchRecipe();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="container mt-4">
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      <img src={recipe.imageUrl || recipe.image} alt={recipe.title} className="img-fluid mb-3" />
      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
      </ul>
      <h4>Instructions:</h4>
      <p>{recipe.instructions}</p>

      <hr />

      {user && (
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Leave a comment"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <select
              className="form-select"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
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

      <h5>Comments:</h5>
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