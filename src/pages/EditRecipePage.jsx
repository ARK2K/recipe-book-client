import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Image } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const EditRecipePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null); // For new file input
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // To display current image
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // For form submission loading
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // Get recipe ID from URL
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`);

        // Populate form fields
        setTitle(data.title);
        setDescription(data.description);
        setIngredients(data.ingredients.join('\n')); // Convert array back to newline string
        setInstructions(data.instructions);
        setCategory(data.category || '');
        setTags(data.tags ? data.tags.join(', ') : ''); // Convert array back to comma string
        setCurrentImageUrl(data.image);

        // Check if user is the creator
        if (user._id !== data.user._id) {
          toast.error('You are not authorized to edit this recipe.');
          navigate(`/recipes/${id}`); // Redirect if not creator
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || 'Failed to fetch recipe for editing');
        navigate('/'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    if (user) { // Only fetch if user is logged in
      fetchRecipe();
    } else {
      setLoading(false); // If no user, PrivateRoute will handle redirect
    }
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', JSON.stringify(ingredients.split('\n').filter(Boolean)));
    formData.append('instructions', instructions);
    if (image) {
      formData.append('image', image); // Append new file if selected
    }
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim()).filter(Boolean)));

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(`http://localhost:5000/api/recipes/${id}`, formData, config);
      toast.success('Recipe updated successfully!');
      navigate(`/recipes/${id}`); // Redirect to updated recipe detail
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update recipe');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <Link to={`/recipes/${id}`} className="btn btn-light my-3">
        Go Back
      </Link>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>Edit Recipe</h1>
          {updating && <Spinner animation="border" className="mb-3" />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter recipe title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Brief description of the recipe"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="ingredients" className="mb-3">
              <Form.Label>Ingredients (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="e.g., 2 cups flour&#10;1 tsp baking powder"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="instructions" className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={7}
                placeholder="Step-by-step cooking instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Recipe Image</Form.Label>
              {currentImageUrl && (
                <div className="mb-2">
                  <Image src={currentImageUrl} alt="Current Recipe" fluid style={{ maxWidth: '200px' }} />
                  <small className="ms-2 text-muted">Current Image</small>
                </div>
              )}
              <Form.Control
                type="file"
                onChange={handleImageChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Breakfast, Dinner, Dessert"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="tags" className="mb-3">
              <Form.Label>Tags (Comma-separated, Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., healthy, quick, vegetarian"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3" disabled={updating}>
              {updating ? 'Updating Recipe...' : 'Update Recipe'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditRecipePage;