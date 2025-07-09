import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { user, favorites, setFavorites } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const isFavorite = favorites.includes(id);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipeService.getRecipeById(id);
        setRecipe(res);
      } catch (err) {
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
        setFavorites(prev => [...prev, id]);
      } else {
        setFavorites(prev => prev.filter(fid => fid !== id));
      }
    } catch (err) {
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
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img src={recipe.imageUrl || recipe.image || '/placeholder.png'} alt={recipe.title} className="w-full h-80 object-cover rounded-xl" />
      <h1 className="text-3xl font-bold my-3">{recipe.title}</h1>
      <p className="text-gray-600">By {recipe.creatorName}</p>

      <h2 className="text-xl font-semibold mt-4">Ingredients:</h2>
      <ul className="list-disc list-inside">
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Instructions:</h2>
      <p>{recipe.instructions}</p>

      {user && (
        <button
          onClick={handleFavorite}
          className={`mt-4 btn ${isFavorite ? 'btn-danger' : 'btn-warning'}`}
        >
          {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
        </button>
      )}

      <h2 className="text-xl font-semibold mt-6">Leave a Comment</h2>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-2 rounded my-2"
        placeholder="Your comment"
      />
      <div className="flex items-center gap-2">
        <label>Rating:</label>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`text-2xl ${rating >= star ? 'text-warning' : 'text-muted'}`}
            onClick={() => setRating(star)}
            type="button"
          >
            ★
          </button>
        ))}
      </div>
      <button onClick={handleComment} className="mt-2 btn btn-primary">
        Post Comment
      </button>

      <h2 className="text-xl font-semibold mt-6">Comments</h2>
      {recipe.comments.map((c, idx) => (
        <div key={idx} className="border-top pt-2 mt-2">
          <p className="fw-bold">{c.user?.name || 'Anonymous'}</p>
          <p>{c.text}</p>
          <div className="text-warning">
            {Array.from({ length: c.stars }, (_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <p className="text-muted">{new Date(c.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default RecipeDetailPage;