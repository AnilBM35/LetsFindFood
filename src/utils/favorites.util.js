import api from './api.util';
import { showErrorToast, showSuccessToast } from './toastify.util';

const favoritesUtil = {
  // Get all favorites for a user
  getUserFavorites: async (userId) => {
    try {
      const response = await api.get(`/favorites?userId=${userId}`);
      return response.data;
    } catch (error) {
      showErrorToast('Failed to fetch favorites');
      throw error;
    }
  },

  // Add to favorites
  addFavorite: async (userId, mealId) => {
    try {
      const response = await api.post('/favorites', {
        userId,
        mealId,
        createdAt: new Date().toISOString()
      });
      showSuccessToast('Added to favorites!');
      return response.data;
    } catch (error) {
      showErrorToast('Failed to add favorite');
      throw error;
    }
  },

  // Remove from favorites
  removeFavorite: async (userId, mealId) => {
    try {
      // First find the favorite entry
      const favorites = await api.get(`/favorites?userId=${userId}&mealId=${mealId}`);
      if (favorites.data.length > 0) {
        await api.delete(`/favorites/${favorites.data[0].id}`);
        showSuccessToast('Removed from favorites');
      }
    } catch (error) {
      showErrorToast('Failed to remove favorite');
      throw error;
    }
  },

  // Check if meal is favorited by user
  isMealFavorited: async (userId, mealId) => {
    try {
      const response = await api.get(`/favorites?userId=${userId}&mealId=${mealId}`);
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }
};

export default favoritesUtil;