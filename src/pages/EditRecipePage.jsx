import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import recipeService from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id);
        setTitle(data.title);
        setDescription(data.description);
        setIngredients(data.ingredients.join('\n'));
        setInstructions(data.instructions);
        setImageUrl(data.imageUrl || '');
        setCategory(data.category || '');
        setTags(data.tags ? data.tags.join(', ') : '');
      } catch {
        setError('Failed to load recipe for editing.');
        toast.error('Failed to load recipe for editing.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let newImageUrl = imageUrl;
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      try {
        const uploadResponse = await recipeService.uploadRecipeImage(formData, user.token);
        newImageUrl = uploadResponse.imageUrl;
      } catch (uploadError) {
        toast.error(uploadError.response?.data?.message || 'Image upload failed');
        return;
      }
    }

    try {
      const updatedRecipe = {
        title,
        description,
        ingredients: ingredients.split('\n').map(item => item.trim()).filter(item => item),
        instructions,
        imageUrl: newImageUrl,
        category: category.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      await recipeService.updateRecipe(id, updatedRecipe, user.token);
      toast.success('Recipe updated successfully!');
      navigate(`/recipes/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update recipe');
    }
  };

  if (loading) return <Container>Loading recipe for editing...</Container>;
  if (error) return <Container>Error: {error}</Container>;

  return (
    <Container>
      <h1>Edit Recipe</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipe title"
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
            placeholder="Describe your recipe"
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
            placeholder="Enter each ingredient on a new line"
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
            placeholder="Provide step-by-step instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="recipeImage">
          <Form.Label>Recipe Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="Current Recipe" style={{ maxWidth: '200px', height: 'auto' }} />
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category (Optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Italian, Dessert, Vegan"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="tags">
          <Form.Label>Tags (Comma-separated, Optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., quick, healthy, breakfast"
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