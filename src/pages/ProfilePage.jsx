import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import RecipeCard from '../components/RecipeCard';
import { Button, Form, Row, Col } from 'react-bootstrap';

const ProfilePage = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('your');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'your' ? '/api/recipes/my-recipes' : '/api/users/favorites';
      const res = await axiosInstance.get(endpoint, {
        params: filter ? { filter } : {},
      });
      if (activeTab === 'your') {
        setMyRecipes(res.data);
      } else {
        setFavorites(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [activeTab, filter]);

  const renderRecipes = (recipes) => {
    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (recipes.length === 0) return <p>No recipes found.</p>;

    return (
      <Row>
        {recipes.map((recipe) => (
          <Col key={recipe._id} md={4}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Profile</h2>

      <div className="mb-3">
        <Button
          variant={activeTab === 'your' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('your')}
          className="me-2"
        >
          Your Recipes
        </Button>
        <Button
          variant={activeTab === 'favorites' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </Button>
      </div>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Filter by tag or category"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Col>
      </Row>

      {activeTab === 'your' ? renderRecipes(myRecipes) : renderRecipes(favorites)}
    </div>
  );
};

export default ProfilePage;