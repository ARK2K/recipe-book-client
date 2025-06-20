import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

const RecipeCard = ({ recipe, isFavorited = false, showFavoriteButton = false }) => {
  const { user, token, favorites, setFavorites } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/api/users/favorites/${recipe._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="my-3 p-3 rounded" style={{ backgroundColor: '#f0f2f5' }}>
      <Link to={`/recipes/${recipe._id}`}>
        {recipe.imageUrl && (
          <Card.Img
            src={recipe.imageUrl}
            variant="top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
      </Link>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Link to={`/recipes/${recipe._id}`}>
            <Card.Title as="div">
              <strong>{recipe.title}</strong>
            </Card.Title>
          </Link>
          {showFavoriteButton && user && (
            <Button
              variant="link"
              className="p-0 ms-2"
              onClick={handleFavoriteToggle}
              disabled={loading}
              aria-label="Toggle favorite"
            >
              <i
                className={`fa${isFavorited ? 's' : 'r'} fa-heart`}
                style={{ color: isFavorited ? 'red' : 'gray', fontSize: '1.3rem' }}
              ></i>
            </Button>
          )}
        </div>

        <Card.Text as="div">
          <div className="my-2">
            {recipe.averageRating > 0 ? (
              <span>
                {recipe.averageRating.toFixed(1)}{' '}
                <i className="fas fa-star" style={{ color: 'gold' }}></i>{' '}
                ({recipe.numReviews} reviews)
              </span>
            ) : (
              <span>No ratings yet</span>
            )}
          </div>
        </Card.Text>

        <Card.Text as="p">{recipe.description.substring(0, 100)}...</Card.Text>

        {recipe.category && (
          <Link to={`/?category=${encodeURIComponent(recipe.category)}`}>
            <Badge bg="info" className="me-2">{recipe.category}</Badge>
          </Link>
        )}

        {recipe.tags && recipe.tags.map((tag, idx) => (
          <Link key={idx} to={`/?tag=${encodeURIComponent(tag)}`}>
            <Badge bg="secondary" className="me-1">#{tag}</Badge>
          </Link>
        ))}
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;