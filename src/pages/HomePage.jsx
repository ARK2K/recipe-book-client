import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axios.get('https://recipe-book-server-5u08.onrender.com/api/recipes');
        console.log('Fetched recipes:', data);
        setRecipes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load recipes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container className="text-danger mt-5">{error}</Container>;

  return (
    <Container className="my-4">
      <h1 className="mb-4">Recipe Book</h1>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {recipes.map(recipe => (
          <Col key={recipe._id}>
            <Card className="h-100">
              {recipe.image && (
                <Card.Img
                  variant="top"
                  src={recipe.image}
                  alt={recipe.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {recipe.creatorName ? `By ${recipe.creatorName}` : ''}
                </Card.Subtitle>
                <Card.Text>
                  {recipe.description?.substring(0, 100)}...
                </Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </small>
                <small className="text-muted">
                  ⭐ {recipe.averageRating?.toFixed(1) || 0}
                </small>
              </Card.Footer>
              <Link to={`/recipes/${recipe._id}`} className="stretched-link"></Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;