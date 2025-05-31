import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    api.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => toast.error('Failed to load recipe'));
  }, [id]);

  const submitRating = async (newRating) => {
    if (!user) {
      toast.error('Login to rate');
      return;
    }
    setSubmittingRating(true);
    try {
      await api.post(`/api/recipes/${id}/rate`, { rating: newRating }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Thanks for rating!');
      setRating(newRating);
      // Refresh recipe to update avg rating
      const res = await api.get(`/api/recipes/${id}`);
      setRecipe(res.data);
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="col-md-8 offset-md-2">
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      <h5>Ingredients</h5>
      <ul>
        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>
      <h5>Instructions</h5>
      <p style={{ whiteSpace: 'pre-line' }}>{recipe.instructions}</p>

      <h5>Average Rating: {recipe.averageRating?.toFixed(1) || 'No ratings yet'}</h5>
      <div>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            className={`btn btn-sm ${star <= rating ? 'btn-warning' : 'btn-outline-secondary'} me-1`}
            disabled={submittingRating}
            onClick={() => submitRating(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="mt-3">
        <h6>Share this recipe:</h6>
        <input
          className="form-control"
          type="text"
          readOnly
          value={`${window.location.origin}/recipes/${id}`}
          onFocus={e => e.target.select()}
        />
      </div>
    </div>
  );
}

export default RecipeDetails;