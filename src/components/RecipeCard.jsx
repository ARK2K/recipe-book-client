import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      {/* Recipe Image */}
      {recipe.imageUrl || recipe.image ? (
        <img
          src={recipe.imageUrl || recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      {/* Recipe Details */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{recipe.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
        <div className="text-xs text-gray-500 mt-2">By: {recipe.creatorName || 'Unknown'}</div>
      </div>
    </div>
  );
};

export default RecipeCard;