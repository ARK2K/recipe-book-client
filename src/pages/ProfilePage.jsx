import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import RecipeCard from '../components/RecipeCard';
import { Form, Row, Col } from 'react-bootstrap';

const ProfilePage = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await axiosInstance.get('/api/recipes/my-recipes');
        setMyRecipes(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  useEffect(() => {
    let filtered = [...myRecipes];
    if (filterCategory)
      filtered = filtered.filter(r => r.category?.toLowerCase().includes(filterCategory.toLowerCase()));
    if (filterTag)
      filtered = filtered.filter(r => r.tags?.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())));
    setFiltered(filtered);
  }, [filterCategory, filterTag, myRecipes]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Your Recipes</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Filter by Tag"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filtered.length > 0 ? (
        <div className="row">
          {filtered.map((recipe) => (
            <div key={recipe._id} className="col-md-4">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default ProfilePage;