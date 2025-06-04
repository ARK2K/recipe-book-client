import axiosInstance from '../utils/axiosInstance';

const recipeService = {
  getAllRecipes: async () => {
    const response = await axiosInstance.get('/api/recipes');
    return response.data;
  },

  getRecipeById: async (id) => {
    const response = await axiosInstance.get(`/api/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (recipeData, token) => {
    const response = await axiosInstance.post('/api/recipes', recipeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateRecipe: async (id, recipeData, token) => {
    const response = await axiosInstance.put(`/api/recipes/${id}`, recipeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteRecipe: async (id, token) => {
    const response = await axiosInstance.delete(`/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  uploadRecipeImage: async (imageData, token) => {
    const response = await axiosInstance.post('/api/recipes/upload', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default recipeService;