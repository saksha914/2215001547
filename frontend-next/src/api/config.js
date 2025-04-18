export const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

export const ENDPOINTS = {
    USERS: {
        GET_ALL: '/users',
        GET_USER_POSTS: (userId) => `/users/${userId}/posts`,
    },
    POSTS: {
        GET_ALL: '/posts',
        GET_COMMENTS: (postId) => `/posts/${postId}/comments`,
    },
}; 