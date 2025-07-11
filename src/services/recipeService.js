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
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axiosInstance.post('/api/recipes/upload', imageData, {
      headers,
    });
    return response.data;
  },

  toggleFavorite: async (id, token) => {
    const response = await axiosInstance.post(`/api/recipes/favorites/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { message } = response.data;
    const added = message.toLowerCase().includes('added');
    return { message, added };
  },

  getFavorites: async (token) => {
    const response = await axiosInstance.get('/api/recipes/favorites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  refreshFavorites: async (token) => {
    return await recipeService.getFavorites(token);
  },

  submitRating: async (id, stars, token) => {
    const response = await axiosInstance.post(`/api/recipes/${id}/rate`, { stars }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  submitComment: async (id, { comment, rating }, token) => {
    const response = await axiosInstance.post(`/api/recipes/${id}/comment`, {
      comment,
      rating,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default recipeService;