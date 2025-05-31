import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function RecipeForm() {
  const { id } = useParams(); // recipe id if editing
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  // Load recipe data if editing
  useEffect(() => {
    if (!id) return; // no id means creating new

    setLoading(true);
    api.get(`/api/recipes/${id}`)
      .then(res => {
        const r = res.data;
        setTitle(r.title || '');
        setDescription(r.description || '');
        setIngredients(r.ingredients.length ? r.ingredients : ['']);
        setInstructions(r.instructions || '');
      })
      .catch(() => toast.error('Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [id]);

  // Add new ingredient input field
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  // Remove ingredient input field
  const removeIngredient = (index) => {
    if (ingredients.length === 1) return; // keep at least one input
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Update ingredient value
  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Submit handler (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    const cleanedIngredients = ingredients.map(i => i.trim()).filter(i => i.length > 0);
    if (cleanedIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    if (!instructions.trim()) {
      toast.error('Instructions are required');
      return;
    }

    if (!user?.token) {
      toast.error('You must be logged in to submit a recipe');
      return;
    }

    const recipeData = {
      title: title.trim(),
      description: description.trim(),
      ingredients: cleanedIngredients,
      instructions: instructions.trim(),
    };

    setLoading(true);

    try {
      if (id) {
        await api.put(`/api/recipes/${id}`, recipeData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        toast.success('Recipe updated successfully');
        navigate(`/recipes/${id}`);
      } else {
        const res = await api.post('/api/recipes', recipeData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        toast.success('Recipe created successfully');
        navigate(`/recipes/${res.data._id}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save recipe';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-4">
      <h2>{id ? 'Edit Recipe' : 'Create New Recipe'}</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label" htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ingredients *</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                value={ingredient}
                onChange={e => updateIngredient(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length === 1}
              >
                &times;
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={addIngredient}>
            + Add Ingredient
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="instructions">Instructions *</label>
          <textarea
            id="instructions"
            className="form-control"
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            rows={6}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {id ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}

export default RecipeForm;