import api from './api.util';
import { showErrorToast } from './toastify.util';

const commentUtil = {
  // Get all comments for a meal
  getMealComments: async (mealId) => {
    try {
      const query = `/comments?mealId=${mealId}&_sort=createdAt`;
      const response = await api.get(query);
      console.log('API response for comments:', response.data);
      return response.data;
    } catch (error) {
      showErrorToast('Failed to fetch comments');
      throw error;
    }
  },

  // Add a new comment
  addComment: async (commentData) => {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      showErrorToast('Failed to add comment');
      throw error;
    }
  },

  // Update a comment (for likes or replies)
  updateComment: async (commentId, updatedComment) => {
    try {
      const response = await api.put(`/comments/${commentId}`, updatedComment);
      return response.data;
    } catch (error) {
      showErrorToast('Failed to update comment');
      throw error;
    }
  },
};

export default commentUtil;