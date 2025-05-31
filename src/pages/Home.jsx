import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get('/api/recipes');
        setRecipes(res.data.recipes);
      } catch (error) {
        console.error('Failed to fetch recipes', error);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Latest Recipes</h2>
      <div className="row">
        {recipes.map(recipe => (
          <div key={recipe._id} className="col-12 col-sm-6 col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text flex-grow-1">{recipe.description}</p>
                <Link
                  to={`/recipes/${recipe._id}`}
                  className="btn btn-sm btn-outline-primary mt-auto align-self-start"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
        {recipes.length === 0 && (
          <p className="text-center">No recipes found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;