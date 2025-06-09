import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

function EditRecipePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.warning('Please log in to access this page');
      navigate('/login');
      return;
    }

    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setTitle(data.title);
        setDescription(data.description);
        setIngredients(data.ingredients.join('\n'));
        setInstructions(data.instructions);
        setExistingImageUrl(data.imageUrl || '');
        setCategory(data.category || '');
        setTags((data.tags || []).join(', '));
        setCreatorId(data.creatorId);
        setLoading(false);

        if (data.creatorId !== user._id) {
          toast.error('You are not authorized to edit this recipe.');
          navigate('/');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch recipe');
        navigate('/');
      }
    };

    fetchRecipe();
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error('Not authorized. Please log in again.');
      return;
    }

    let imageUrl = existingImageUrl;
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      try {
        const uploadResponse = await recipeService.uploadRecipeImage(formData);
        imageUrl = uploadResponse.imageUrl;
      } catch (uploadError) {
        toast.error(uploadError.response?.data?.message || 'Image upload failed');
        return;
      }
    }

    try {
      const updatedRecipe = {
        title,
        description,
        ingredients: ingredients.split('\n').map(item => item.trim()).filter(Boolean),
        instructions,
        imageUrl,
        category: category.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      await recipeService.updateRecipe(id, updatedRecipe);
      toast.success('Recipe updated successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update recipe');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  return (
    <Container>
      <h1>Edit Recipe</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="ingredients">
          <Form.Label>Ingredients (one per line)</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="instructions">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={7}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </Form.Group>

        {existingImageUrl && (
          <div className="mb-3">
            <Form.Label>Current Image</Form.Label>
            <div>
              <img
                src={existingImageUrl}
                alt="Current"
                style={{ width: '200px', borderRadius: '5px' }}
              />
            </div>
          </div>
        )}

        <Form.Group className="mb-3" controlId="recipeImage">
          <Form.Label>Change Recipe Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category (Optional)</Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="tags">
          <Form.Label>Tags (Comma-separated, Optional)</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Update Recipe
        </Button>
      </Form>
    </Container>
  );
}

export default EditRecipePage;