import apiClient from './apiClient';
import { ENDPOINTS } from './config';

const postService = {
    getPostComments: async (postId) => {
        try {
            const response = await apiClient.get(ENDPOINTS.POSTS.GET_COMMENTS(postId));
            return response.data.comments;
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            throw error;
        }
    },
};

export default postService; 