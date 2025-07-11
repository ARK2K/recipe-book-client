import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';

const RecipeCard = ({ recipe }) => {
  const { favorites, setFavorites } = useAuth();
  const isFavorite = favorites.includes(recipe._id);

  const handleFavorite = async () => {
    try {
      const res = await recipeService.toggleFavorite(recipe._id);
      toast.success(res.message);
      if (res.added) {
        setFavorites((prev) => [...prev, recipe._id]);
      } else {
        setFavorites((prev) => prev.filter((id) => id !== recipe._id));
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="ratio ratio-4x3">
        <img
          src={recipe.imageUrl || recipe.image || '/placeholder.png'}
          className="card-img-top object-fit-contain"
          alt={recipe.title}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{recipe.title}</h5>
        <p className="card-text text-muted">{recipe.description?.slice(0, 100)}...</p>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/recipes/${recipe._id}`} className="btn btn-sm btn-primary">
            View
          </Link>
          <button
            onClick={handleFavorite}
            className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-warning'}`}
          >
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;