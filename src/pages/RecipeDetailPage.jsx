import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Loader from '../components/Loader';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setSubmitting(true);
      await axiosInstance.post(`/api/recipes/${id}/comment`, { comment: commentText });
      const { data } = await axiosInstance.get(`/api/recipes/${id}`);
      setRecipe(data);
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

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

      <hr />
      <h4>Comments</h4>
      {recipe.comments?.length > 0 ? (
        <ul className="list-group mb-3">
          {recipe.comments.map((c) => (
            <li key={c._id} className="list-group-item">
              <strong>{c.user?.name || 'User'}:</strong> {c.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}

      <form onSubmit={handleCommentSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}

export default RecipeDetailPage;