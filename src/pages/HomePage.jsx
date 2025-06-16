import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import RecipeCard from '../components/RecipeCard';

const Homepage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axiosInstance.get('/api/recipes', {
          params: { sort: sortBy, ingredient: filter, category, tag }
        });
        setRecipes(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [sortBy, filter, category, tag]);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Recipes</h1>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Top Rated</option>
          </Form.Select>
        </Col>
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Filter by ingredient"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Col>
      </Row>

      {(category || tag || filter) && (
        <div className="mb-3">
          <Link to="/" className="btn btn-outline-secondary btn-sm">Clear Filters</Link>
        </div>
      )}

      <Row>
        {recipes.map(recipe => (
          <Col key={recipe._id} md={4} className="mb-4">
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Homepage;