import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [profileRecipes, setProfileRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [errorRecipes, setErrorRecipes] = useState(null);


  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user) {
        setLoadingRecipes(false);
        return;
      }
      try {
        setLoadingRecipes(true);
        setErrorRecipes(null);
        // You'll need a backend endpoint for user's recipes or filter client-side
        // For simplicity, we'll fetch all recipes and filter. A dedicated endpoint is better for performance.
        const { data } = await axios.get(`http://localhost:5000/api/recipes`);
        const userRecipes = data.recipes.filter(recipe => recipe.user._id === user._id);
        setProfileRecipes(userRecipes);
      } catch (err) {
        setErrorRecipes(err.response?.data?.message || 'Failed to fetch user recipes');
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchUserRecipes();
  }, [user]);

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      // This requires a PUT /api/auth/profile endpoint on backend to update user info
      // You'll need to implement this in authController and authRoutes
      // For now, this is a placeholder.
      // const config = {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${user.token}`,
      //   },
      // };
      // const { data } = await axios.put('http://localhost:5000/api/auth/profile', { name: profileName, email: profileEmail }, config);
      // localStorage.setItem('userInfo', JSON.stringify(data)); // Update localStorage
      // setUser(data); // Update context
      toast.success('Profile updated successfully (frontend placeholder)');
      setLoadingUpdate(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      setLoadingUpdate(false);
    }
  };

  if (!user) {
    return <Alert variant="info">Please log in to view your profile.</Alert>;
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={updateProfileHandler}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Add password change if desired */}

          <Button type="submit" variant="primary" disabled={loadingUpdate}>
            {loadingUpdate ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Recipes</h2>
        {loadingRecipes ? (
          <Spinner animation="border" />
        ) : errorRecipes ? (
          <Alert variant="danger">{errorRecipes}</Alert>
        ) : profileRecipes.length === 0 ? (
          <Alert variant="info">You haven't created any recipes yet. <Link to="/recipes/new">Create one!</Link></Alert>
        ) : (
          <Row>
            {profileRecipes.map((recipe) => (
              <Col key={recipe._id} sm={12} md={6} lg={4}>
                <RecipeCard recipe={recipe} />
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default ProfilePage;