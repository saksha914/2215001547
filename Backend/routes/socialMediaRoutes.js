const express = require('express');
const router = express.Router();
const SocialMediaService = require('../services/socialMediaService');
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                status: 401,
                message: 'Authorization header is missing'
            });
        }

        const authToken = authHeader.split(' ')[1];
        if (!authToken) {
            return res.status(401).json({
                status: 401,
                message: 'Bearer token is missing'
            });
        }

        req.authToken = authToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            status: 401,
            message: 'Invalid authorization header format'
        });
    }
};


const validatePostType = (req, res, next) => {
    const { type } = req.query;
    if (type && !['latest', 'popular'].includes(type)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid post type. Must be either "latest" or "popular"'
        });
    }
    next();
};


router.get('/users/top', verifyToken, async (req, res) => {
    try {
        const result = await SocialMediaService.getTopUsers(req.authToken);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Route Error - Get Top Users:', error);
        return res.status(500).json({
            status: 500,
            message: 'Failed to fetch top users'
        });
    }
});


router.get('/posts', [verifyToken, validatePostType], async (req, res) => {
    try {
        const { type = 'latest' } = req.query;
        const result = await SocialMediaService.getPosts(type, req.authToken);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Route Error - Get Posts:', error);
        return res.status(500).json({
            status: 500,
            message: 'Failed to fetch posts'
        });
    }
});

module.exports = router; 