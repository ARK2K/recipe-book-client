import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';

const Homepage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState('newest');
  const [ingredientFilter, setIngredientFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axiosInstance.get('/api/recipes', {
          params: {
            sort: sortBy,
            ingredient: ingredientFilter,
            category: categoryFilter,
            tag: tagFilter,
          }
        });
        setRecipes(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [sortBy, ingredientFilter, categoryFilter, tagFilter]);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Recipes</h1>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Top Rated</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by ingredient"
            value={ingredientFilter}
            onChange={(e) => setIngredientFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Filter by tag"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        {recipes.map(recipe => (
          <Col key={recipe._id} md={4} className="mb-4">
            <Card>
              {recipe.imageUrl && <Card.Img variant="top" src={recipe.imageUrl} alt={recipe.title} />}
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                {recipe.creatorName && (
                  <Card.Subtitle className="mb-2 text-muted">
                    Creator: {recipe.creatorName}
                  </Card.Subtitle>
                )}
                <Card.Text>{recipe.description}</Card.Text>
                {recipe.averageRating > 0 && (
                  <Card.Text>
                    <strong>Rating:</strong> {recipe.averageRating} ({recipe.numReviews} reviews)
                  </Card.Text>
                )}
                <Card.Text>
                  <small>Created on: {new Date(recipe.createdAt).toLocaleDateString()}</small>
                </Card.Text>
                <Button variant="primary" as={Link} to={`/recipes/${recipe._id}`}>
                  View Recipe
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Homepage;