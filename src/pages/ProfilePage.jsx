import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import RecipeCard from '../components/RecipeCard';
import { Form, Row, Col, Nav } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const ProfilePage = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState('my');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myRes, favRes] = await Promise.all([
          axiosInstance.get('/api/recipes/my-recipes'),
          axiosInstance.get('/api/recipes/favorites'),
        ]);
        setMyRecipes(myRes.data);
        setFavorites(favRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const tagParam = searchParams.get('tag') || '';
    const categoryParam = searchParams.get('category') || '';
    setFilterTag(tagParam);
    setFilterCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    const data = activeTab === 'my' ? myRecipes : favorites;
    let filteredData = [...data];

    if (filterCategory)
      filteredData = filteredData.filter(r =>
        r.category?.toLowerCase().includes(filterCategory.toLowerCase())
      );

    if (filterTag)
      filteredData = filteredData.filter(r =>
        r.tags?.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase()))
      );

    if (sortBy === 'newest') {
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'rating') {
      filteredData.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    setFiltered(filteredData);
  }, [filterCategory, filterTag, sortBy, activeTab, myRecipes, favorites]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Profile</h2>

      <Nav variant="tabs" activeKey={activeTab} onSelect={k => setActiveTab(k)}>
        <Nav.Item>
          <Nav.Link eventKey="my">Your Recipes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="favorites">Favorites</Nav.Link>
        </Nav.Item>
      </Nav>

      <Row className="my-3">
        <Col md={4}>
          <Form.Control
            placeholder="Filter by Category"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Filter by Tag"
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Top Rated</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filtered.length > 0 ? (
        <Row>
          {filtered.map(recipe => (
            <Col key={recipe._id} md={4} className="mb-4">
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default ProfilePage;