import { useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const AddRecipePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', JSON.stringify(ingredients.split('\n').filter(Boolean)));
    formData.append('instructions', instructions);
    if (image) {
      formData.append('image', image);
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

      await axios.post('http://localhost:5000/api/recipes', formData, config);
      toast.success('Recipe created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>Add New Recipe</h1>
          {loading && <Spinner animation="border" className="mb-3" />}
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
                placeholder="e.g., 2 cups flour\n1 tsp baking powder"
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


            <Button type="submit" variant="primary" className="mt-3" disabled={loading}>
              {loading ? 'Adding Recipe...' : 'Add Recipe'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddRecipePage;