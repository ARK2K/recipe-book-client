import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  // If editing, fetch existing recipe data
  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/api/recipes/${id}`)
        .then(res => {
          const r = res.data;
          if (r.author._id !== user._id) {
            toast.error('Unauthorized to edit this recipe');
            navigate('/');
            return;
          }
          setTitle(r.title);
          setDescription(r.description);
          setIngredients(r.ingredients.join(', '));
          setInstructions(r.instructions);
        })
        .catch(() => toast.error('Failed to load recipe'))
        .finally(() => setLoading(false));
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        ingredients: ingredients.split(',').map(i => i.trim()),
        instructions,
      };
      if (id) {
        await api.put(`/api/recipes/${id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success('Recipe updated');
      } else {
        await api.post('/api/recipes', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        toast.success('Recipe added');
      }
      navigate('/');
    } catch {
      toast.error('Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-8 offset-md-2">
      <h2>{id ? 'Edit' : 'Add'} Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={loading}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          required
          disabled={loading}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Instructions"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          required
          disabled={loading}
          rows={6}
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : id ? 'Update Recipe' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}

export default RecipeForm;