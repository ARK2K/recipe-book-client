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
      const res = await api.get(`/api/recipes/${id}`);
      setRecipe(res.data);
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (!recipe) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">

          <h2 className="mb-3">{recipe.title}</h2>
          <p>{recipe.description}</p>

          <h5>Ingredients</h5>
          <ul className="list-group mb-4">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="list-group-item">
                {ing}
              </li>
            ))}
          </ul>

          <h5>Instructions</h5>
          <p style={{ whiteSpace: 'pre-line' }} className="mb-4">{recipe.instructions}</p>

          <h5>Average Rating: {recipe.averageRating?.toFixed(1) || 'No ratings yet'}</h5>
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                className={`btn btn-sm me-1 ${star <= rating ? 'btn-warning' : 'btn-outline-secondary'}`}
                disabled={submittingRating}
                onClick={() => submitRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="mt-4">
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
      </div>
    </div>
  );
}

export default RecipeDetails;