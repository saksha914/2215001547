const axios = require('axios');
const BASE_URL = 'http://20.244.56.144/evaluation-service';
const DEFAULT_LIMIT = 5;

class SocialMediaService {

    static async makeApiCall(url, authToken) {
        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${authToken}` },
                timeout: 5000 
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error(`API Error fetching ${url}:`, error.message);
            const status = error.response?.status || (error.code === 'ECONNABORTED' ? 408 : 500);
            return {
                success: false,
                status: status,
                message: error.message
            };
        }
    }

    static async getTopUsers(authToken, limit = DEFAULT_LIMIT) {
        try {
            const usersResult = await this.makeApiCall(`${BASE_URL}/users`, authToken);
            if (!usersResult.success) {
                return { status: usersResult.status, message: usersResult.message };
            }

            const users = usersResult.data.users;
            if (!users || Object.keys(users).length === 0) {
                return { status: 200, data: [] }; 
            }
            const userPostPromises = Object.entries(users).map(async ([userId, name]) => {
                const postsResult = await this.makeApiCall(`${BASE_URL}/users/${userId}/posts`, authToken);
                return {
                    id: userId,
                    name: name, 
                    postCount: postsResult.success ? postsResult.data.posts?.length || 0 : 0
                };
            });

            const usersWithPostCounts = await Promise.all(userPostPromises);
            const topUsers = usersWithPostCounts
                .sort((a, b) => b.postCount - a.postCount)
                .slice(0, limit);

            return {
                status: 200,
                data: topUsers
            };

        } catch (error) {
            console.error('Error in getTopUsers:', error);
            return {
                status: 500,
                message: error.message || 'Internal server error calculating top users'
            };
        }
    }

    static async getTrendingPosts(authToken, limit = DEFAULT_LIMIT) {
        try {
            const usersResult = await this.makeApiCall(`${BASE_URL}/users`, authToken);
            if (!usersResult.success) {
                return { status: usersResult.status, message: usersResult.message };
            }
            const users = usersResult.data.users;
            const usersMap = new Map(Object.entries(users));

            if (!users || Object.keys(users).length === 0) {
                return { status: 200, data: [] };
            }
            const allPostsPromises = Object.keys(users).map(async (userId) => {
                const postsResult = await this.makeApiCall(`${BASE_URL}/users/${userId}/posts`, authToken);
                return postsResult.success ? postsResult.data.posts.map(p => ({ ...p, userId })) : [];
            });
            const postsArrays = await Promise.all(allPostsPromises);
            const allPosts = postsArrays.flat();
            if (allPosts.length === 0) {
                return { status: 200, data: [] };
            }
            const commentPromises = allPosts.map(async (post) => {
                if (!post.id) {
                    console.warn('Post missing ID:', post);
                    return { ...post, commentCount: 0, comments: [] };
                }
                const commentsResult = await this.makeApiCall(`${BASE_URL}/posts/${post.id}/comments`, authToken);
                return {
                    ...post,
                    commentCount: commentsResult.success ? commentsResult.data.comments?.length || 0 : 0,

                };
            });
            const postsWithComments = await Promise.all(commentPromises);
            const maxComments = Math.max(0, ...postsWithComments.map(post => post.commentCount));
            const trendingPosts = postsWithComments
                .filter(post => post.commentCount > 0 && post.commentCount === maxComments)
                .map(post => ({
                    ...post,
                    userName: usersMap.get(String(post.userId)) || 'Unknown User'
                }))
                .sort((a, b) => b.commentCount - a.commentCount)
                .slice(0, limit);

            return {
                status: 200,
                data: trendingPosts
            };

        } catch (error) {
            console.error('Error in getTrendingPosts:', error);
            return {
                status: 500,
                message: error.message || 'Internal server error calculating trending posts'
            };
        }
    }

}

module.exports = SocialMediaService;