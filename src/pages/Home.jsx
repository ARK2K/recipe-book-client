import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await api.get('/api/recipes');
      setRecipes(res.data.recipes);
    };
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Latest Recipes</h2>
      <div className="row">
        {recipes.map(recipe => (
          <div key={recipe._id} className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">{recipe.description}</p>
                <Link to={`/recipes/${recipe._id}`} className="btn btn-sm btn-outline-primary">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;