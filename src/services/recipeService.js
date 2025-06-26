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

  createRecipe: async (recipeData) => {
    const response = await axiosInstance.post('/api/recipes', recipeData);
    return response.data;
  },

  updateRecipe: async (id, recipeData) => {
    const response = await axiosInstance.put(`/api/recipes/${id}`, recipeData);
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await axiosInstance.delete(`/api/recipes/${id}`);
    return response.data;
  },

  uploadRecipeImage: async (imageData) => {
    const response = await axiosInstance.post('/api/recipes/upload', imageData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  toggleFavorite: async (id) => {
    const response = await axiosInstance.post(`/api/recipes/favorites/${id}`);
    return response.data;
  },

  submitRating: async (id, stars) => {
    const response = await axiosInstance.post(`/api/recipes/${id}/rate`, { stars });
    return response.data;
  },

  submitComment: async (id, { comment, rating }) => {
    const response = await axiosInstance.post(`/api/recipes/${id}/comment`, { comment, rating });
    return response.data;
  },

  refreshFavorites: async () => {
    const response = await axiosInstance.get('/api/recipes/favorites');
    return response.data.map(r => r._id);
  }
};

export default recipeService;