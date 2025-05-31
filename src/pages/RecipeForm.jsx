import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function RecipeForm({ recipe }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewClick = () => {
    if (!user) {
      toast.error('Please login to view recipe details');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      navigate(`/recipes/${recipe._id}`);
    }
  };

  return (
    <div className="recipe-card">
      <h5>{recipe.title}</h5>
      <p>{recipe.description}</p>
      <button onClick={handleViewClick} className="btn btn-primary">
        View
      </button>
    </div>
  );
}

export default RecipeForm;