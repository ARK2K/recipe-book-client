import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Homepage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axios.get('/api/recipes');
        setRecipes(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Recipe Book</h1>
      <div>
        {recipes.length === 0 && <p>No recipes found.</p>}
        <ul>
          {recipes.map(recipe => (
            <li key={recipe._id} style={{ marginBottom: '1rem' }}>
              <Link to={`/recipes/${recipe._id}`}>
                <h3>{recipe.title}</h3>
              </Link>
              <p>{recipe.description?.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Homepage;