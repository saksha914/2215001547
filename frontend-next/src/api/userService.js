import apiClient from './apiClient';
import { ENDPOINTS } from './config';

const userService = {
    getAllUsers: async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.USERS.GET_ALL);
            return response.data.users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserPosts: async (userId) => {
        try {
            const response = await apiClient.get(ENDPOINTS.USERS.GET_USER_POSTS(userId));
            return response.data.posts;
        } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
            throw error;
        }
    },

    getTopUsers: async (limit = 5) => {
        try {
            const usersResponse = await apiClient.get(ENDPOINTS.USERS.GET_ALL);
            const users = usersResponse.data.users;
            if (!users || Object.keys(users).length === 0) {
                return [];
            }

            const allPostsResponses = await Promise.all(
                Object.keys(users).map(userId =>
                    apiClient.get(ENDPOINTS.USERS.GET_USER_POSTS(userId)).catch(err => {
                        console.warn(`Could not fetch posts for user ${userId} during top user calculation:`, err);
                        return null;
                    })
                )
            );

            const usersWithCounts = Object.entries(users).map(([id, name], index) => {
                const postsResponse = allPostsResponses[index];
                return {
                    id,
                    name,
                    postCount: postsResponse?.data?.posts?.length || 0
                };
            });

            return usersWithCounts
                .sort((a, b) => b.postCount - a.postCount)
                .slice(0, limit);
        } catch (error) {
            console.error('Error fetching top users:', error);
            throw error;
        }
    }
};

export default userService; 