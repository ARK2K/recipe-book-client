import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import recipeService from '../services/recipeService';
import { toast } from 'sonner';

const RecipeCard = ({ recipe, isFavorited, showFavoriteButton }) => {
  const navigate = useNavigate();
  const { refreshFavorites } = useAuth();

  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await recipeService.toggleFavorite(recipe._id);
      toast.success(
        isFavorited ? 'Removed from favorites' : 'Added to favorites'
      );
      await refreshFavorites();
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <Card className="h-100" onClick={() => navigate(`/recipes/${recipe._id}`)} style={{ cursor: 'pointer' }}>
      {recipe.imageUrl && (
        <Card.Img
          variant="top"
          src={recipe.imageUrl}
          alt={recipe.title}
          style={{ objectFit: 'cover', height: '200px' }}
        />
      )}
      <Card.Body>
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text>
          {recipe.description.slice(0, 80)}...
        </Card.Text>
        {showFavoriteButton && (
          <Button
            variant="outline-danger"
            onClick={handleFavorite}
            className="mt-2"
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />} Favorite
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;