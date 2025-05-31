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
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{recipe.title}</h5>
        <p className="card-text flex-grow-1">{recipe.description}</p>
        <button
          onClick={handleViewClick}
          className="btn btn-primary mt-auto align-self-start"
        >
          View
        </button>
      </div>
    </div>
  );
}

export default RecipeForm;