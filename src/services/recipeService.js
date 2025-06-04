import axiosInstance from '../utils/axiosInstance';

const getAuthHeader = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
};

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
    const response = await axiosInstance.post('/api/recipes', recipeData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateRecipe: async (id, recipeData) => {
    const response = await axiosInstance.put(`/api/recipes/${id}`, recipeData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteRecipe: async (id) => {
    const response = await axiosInstance.delete(`/api/recipes/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  uploadRecipeImage: async (imageData) => {
    const response = await axiosInstance.post('/api/recipes/upload', imageData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default recipeService;