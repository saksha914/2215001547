const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const socialMediaRoutes = require('./routes/socialMediaRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
app.use('/api', limiter); 

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Social Media Analytics Service is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api', socialMediaRoutes);

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: `Route ${req.url} not found`
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'SyntaxError') {
        return res.status(400).json({
            status: 400,
            message: 'Invalid JSON payload'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 400,
            message: err.message
        });
    }
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message || 'Something went wrong'
    });
});
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Performing graceful shutdown...');
    process.exit(0);
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
}

module.exports = app;
