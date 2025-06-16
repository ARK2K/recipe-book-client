import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/recipes/${recipe._id}`}>
        {recipe.imageUrl ? (
          <Card.Img
            src={recipe.imageUrl}
            variant="top"
            style={{ height: '200px', objectFit: 'cover' }}
          />
        ) : null}
      </Link>
      <Card.Body>
        <Link to={`/recipes/${recipe._id}`}>
          <Card.Title as="div">
            <strong>{recipe.title}</strong>
          </Card.Title>
        </Link>

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