import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user, favorites, setFavorites } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isFavorite = favorites.includes(id);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipeService.getRecipeById(id);
        setRecipe(res);
      } catch {
        toast.error('Failed to load recipe');
      }
    };
    fetchRecipe();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(id);
      toast.success(res.message);
      if (res.added) {
        setFavorites((prev) => [...prev, id]);
      } else {
        setFavorites((prev) => prev.filter((fid) => fid !== id));
      }
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  const handleComment = async () => {
    if (!comment) return toast.error('Comment cannot be empty');
    try {
      await recipeService.submitComment(id, { comment, rating });
      setComment('');
      setRating(0);
      const updated = await recipeService.getRecipeById(id);
      setRecipe(updated);
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const confirmDelete = async () => {
    try {
      await recipeService.deleteRecipe(recipe._id);
      toast.success('Recipe deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete recipe');
    }
  };

  if (!recipe) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container py-4">
      {/* Image and title */}
      <div className="text-center mb-4">
        <div className="ratio ratio-16x9 mb-3">
          <img
            src={recipe.imageUrl || recipe.image || '/placeholder.png'}
            alt={recipe.title}
            className="img-fluid rounded"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h1>{recipe.title}</h1>
        <p className="text-muted">By {recipe.creatorName}</p>
        {user && (
          <button
            onClick={handleFavorite}
            className={`btn ${isFavorite ? 'btn-danger' : 'btn-warning'} my-2`}
          >
            {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
          </button>
        )}
      </div>

      {/* Ingredients and instructions */}
      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      <h4 className="mt-3">Instructions:</h4>
      <p>{recipe.instructions}</p>

      {/* Edit & Delete */}
      {user?._id === recipe.creatorId && (
        <div className="my-3 d-flex gap-2">
          <Link to={`/recipes/edit/${recipe._id}`} className="btn btn-outline-primary">
            Edit
          </Link>
          <button
            className="btn btn-outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      )}

      {/* Comment form */}
      <hr />
      <h4>Leave a Comment</h4>
      <div className="mb-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
          rows={3}
          placeholder="Your comment"
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
            ★
          </button>
        ))}
      </div>
      <button onClick={handleComment} className="btn btn-primary mb-4">
        Post Comment
      </button>

      {/* Comments List */}
      <h4>Comments</h4>
      {recipe.comments.map((c, idx) => (
        <div key={idx} className="border-top pt-3 mt-3">
          <strong>{c.user?.name || 'Anonymous'}</strong>
          <p>{c.text}</p>
          <div className="text-warning">
            {Array.from({ length: c.stars }, (_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <p className="text-muted">{new Date(c.createdAt).toLocaleString()}</p>
        </div>
      ))}

      {showDeleteModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this recipe?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;