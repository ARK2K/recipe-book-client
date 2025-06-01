import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const RecipeDetailPage = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0); // For user's new rating
  const [ratingLoading, setRatingLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(data);
        // Pre-fill user's existing rating if they have one
        if (user) {
          const userRating = data.ratings.find(r => r.user === user._id);
          if (userRating) {
            setRating(userRating.stars);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]); // Re-fetch if user changes (e.g. login/logout)

  const deleteHandler = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/recipes/${id}`, config);
        toast.success('Recipe deleted successfully!');
        navigate('/');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete recipe');
      }
    }
  };

  const submitRatingHandler = async (e) => {
    e.preventDefault();
    setRatingLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(`http://localhost:5000/api/recipes/${id}/rate`, { stars: rating }, config);
      toast.success('Recipe rated successfully!');
      // Re-fetch recipe to update ratings
      const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rate recipe');
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={recipe.image} alt={recipe.title} fluid />
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{recipe.title}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                Description: {recipe.description}
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="my-3">
                  {recipe.averageRating.toFixed(1)} <i className="fas fa-star" style={{ color: 'gold' }}></i>{' '}
                  ({recipe.numReviews} reviews)
                </div>
              </ListGroup.Item>
              <ListGroup.Item>
                Ingredients:
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </ListGroup.Item>
              <ListGroup.Item>
                Instructions:
                <p>{recipe.instructions}</p>
              </ListGroup.Item>
              {recipe.user && recipe.user.name && (
                <ListGroup.Item>
                  Created by: <strong>{recipe.user.name}</strong>
                </ListGroup.Item>
              )}
            </ListGroup>

            {user && recipe.user && user._id === recipe.user._id && (
              <Card className="my-3 p-3">
                <Card.Body>
                  <Card.Title>Manage Recipe</Card.Title>
                  <Link to={`/recipes/${recipe._id}/edit`} className="btn btn-info me-2">
                    Edit Recipe
                  </Link>
                  <Button variant="danger" onClick={deleteHandler}>
                    Delete Recipe
                  </Button>
                </Card.Body>
              </Card>
            )}

            <Card className="my-3 p-3">
              <Card.Body>
                <Card.Title>Rate This Recipe</Card.Title>
                {user ? (
                  <>
                    <Form onSubmit={submitRatingHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Stars</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          disabled={ratingLoading}
                        >
                          <option value="0">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        className="mt-3"
                        disabled={ratingLoading || recipe.ratings.some(r => r.user === user._id)} // Disable if already rated
                      >
                        {ratingLoading ? 'Submitting...' : (recipe.ratings.some(r => r.user === user._id) ? 'Already Rated' : 'Submit Rating')}
                      </Button>
                    </Form>
                  </>
                ) : (
                  <Alert variant="info">Please <Link to="/login">log in</Link> to rate this recipe.</Alert>
                )}
              </Card.Body>
            </Card>

            {/* Optional: Add comments section here */}

          </Col>
        </Row>
      )}
    </>
  );
};

export default RecipeDetailPage;