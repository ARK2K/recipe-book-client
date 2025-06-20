import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../contexts/AuthContext';

const Homepage = () => {
  const { user, loading: authLoading, favorites } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filter, setFilter] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchRecipes = async () => {
      try {
        const { data } = await axiosInstance.get('/api/recipes', {
          params: { sort: sortBy, ingredient: filter, category, tag },
        });
        setRecipes(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [sortBy, filter, category, tag, user]);

  const handleClearFilters = () => {
    setFilter('');
    navigate('/', { replace: true });
  };

  if (authLoading || loading) return <p>Loading recipes...</p>;
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
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}

      <Row>
        {recipes.map((recipe) => (
          <Col key={recipe._id} md={4} className="mb-4">
            <RecipeCard
              recipe={recipe}
              isFavorited={favorites.includes(recipe._id)}
              showFavoriteButton
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Homepage;