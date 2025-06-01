import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/recipes/${recipe._id}`}>
        <Card.Img src={recipe.image} variant="top" style={{ height: '200px', objectFit: 'cover' }} />
      </Link>
      <Card.Body>
        <Link to={`/recipes/${recipe._id}`}>
          <Card.Title as="div">
            <strong>{recipe.title}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            {recipe.averageRating > 0 ? (
              <span>
                {recipe.averageRating.toFixed(1)} <i className="fas fa-star" style={{ color: 'gold' }}></i>{' '}
                ({recipe.numReviews} reviews)
              </span>
            ) : (
              <span>No ratings yet</span>
            )}
          </div>
        </Card.Text>
        <Card.Text as="p">
          {recipe.description.substring(0, 100)}...
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;