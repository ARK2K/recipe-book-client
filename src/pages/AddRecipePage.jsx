import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import recipeService from '../services/recipeService';

function AddRecipePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let imageUrl = '';
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
      const newRecipe = {
        title,
        description,
        ingredients: ingredients.split('\n').map(item => item.trim()).filter(item => item),
        instructions,
        imageUrl,
        category: category.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      await recipeService.createRecipe(newRecipe);
      toast.success('Recipe added successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add recipe');
    }
  };

  return (
    <Container>
      <h1>Add New Recipe</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          ></Form.Control>
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
          ></Form.Control>
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
          ></Form.Control>
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
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="recipeImage">
          <Form.Label>Recipe Image</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category (Optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Italian, Dessert, Vegan"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="tags">
          <Form.Label>Tags (Comma-separated, Optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., quick, healthy, breakfast"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Add Recipe
        </Button>
      </Form>
    </Container>
  );
}

export default AddRecipePage;