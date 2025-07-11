import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button, Modal } from 'react-bootstrap';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, setFavorites } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const isFavorite = favorites.includes(id);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipeService.getRecipeById(id);
        if (!res || Object.keys(res).length === 0) throw new Error('Not found');
        setRecipe(res);
      } catch (err) {
        toast.error('Recipe not found');
        navigate('/');
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(id);
      toast.success(res.message);
      setFavorites((prev) =>
        res.added ? [...prev, id] : prev.filter((fid) => fid !== id)
      );
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

  const handleDelete = async () => {
    try {
      await recipeService.deleteRecipe(id);
      toast.success('Recipe deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete recipe');
    }
  };

  if (!recipe) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container py-4">
      <img
        src={recipe.imageUrl || recipe.image || '/placeholder.png'}
        alt={recipe.title}
        className="img-fluid rounded mb-3"
        style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
      />
      <h1 className="display-5 fw-bold mb-1">{recipe.title}</h1>
      <p className="text-muted">By {recipe.creatorName}</p>

      <h2 className="h5 mt-4">Ingredients:</h2>
      <ul className="list-group list-group-flush">
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx} className="list-group-item">{ing}</li>
        ))}
      </ul>

      <h2 className="h5 mt-4">Instructions:</h2>
      <p>{recipe.instructions}</p>

      {user && (
        <Button
          variant={isFavorite ? 'danger' : 'warning'}
          className="mt-3 me-2"
          onClick={handleFavorite}
        >
          {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
        </Button>
      )}

      {user && user._id === recipe.creatorId && (
        <>
          <Link to={`/edit/${id}`} className="btn btn-outline-primary mt-3 me-2">Edit</Link>
          <Button variant="outline-danger" className="mt-3" onClick={() => setShowModal(true)}>Delete</Button>
        </>
      )}

      <h2 className="h5 mt-5">Leave a Comment</h2>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="form-control my-2"
        rows={3}
        placeholder="Your comment"
      />
      <div className="d-flex align-items-center gap-2">
        <label className="fw-bold">Rating:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`btn btn-sm ${rating >= star ? 'btn-warning' : 'btn-outline-secondary'}`}
            onClick={() => setRating(star)}
            type="button"
          >
            ★
          </button>
        ))}
      </div>
      <Button onClick={handleComment} className="btn btn-primary mt-2">Post Comment</Button>

      <h2 className="h5 mt-5">Comments</h2>
      {recipe.comments.map((c, idx) => (
        <div key={idx} className="border-top pt-2 mt-2">
          <p className="fw-bold mb-0">{c.user?.name || 'Anonymous'}</p>
          <p className="mb-1">{c.text}</p>
          <div className="text-warning">
            {Array.from({ length: c.stars }, (_, i) => <span key={i}>★</span>)}
          </div>
          <p className="text-muted small">{new Date(c.createdAt).toLocaleString()}</p>
        </div>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this recipe?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecipeDetailPage;