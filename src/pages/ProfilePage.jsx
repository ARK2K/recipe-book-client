import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/users/${username}`);
        setUser(data.user);
        setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
        console.log('User profile:', data); // ✅ Debug log
      } catch (err) {
        console.error('Profile fetch error:', err); // ✅ Better error log
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <h2>Recipes by {user.name}</h2>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
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
      )}
    </div>
  );
};

export default ProfilePage;