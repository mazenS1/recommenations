require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const usersRouter = require('./routes/usersRoute');
const recommendationsRouter = require('./routes/recommednationRoutes');
const sequelize = require('./models/sequelize');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Genre = require('./models/Genre');
const MovieGenre = require('./models/MovieGenre');
const Rating = require('./models/Rating');
const {rateLimiterMiddleware} = require('./middleware/rateLimiter');
const movieRoute = require('./routes/movieRoute');
const tvRoute = require('./routes/tvRoute');
const searchRoute = require('./routes/searchRoute');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://image.tmdb.org"],
        // Add other directives as needed
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(cors({
    origin: process.env.NODE_ENV === 'development' 
        ? ['http://localhost:5173', 'http://127.0.0.1:5173']
        : ['https://newish.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(cookieParser());

// Apply global rate limiting
app.use(rateLimiterMiddleware);

// API routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/recommendations', recommendationsRouter);
app.use('/api/v1/movies', movieRoute);
app.use('/api/v1/tv', tvRoute);
app.use('/api/v1/search', searchRoute);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  }
});

// Initialize associations
[User, Movie, Genre, Rating].forEach(model => {
  if (model.associate) {
    model.associate({ User, Movie, Genre, Rating });
  }
});

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Database Synced');
        
        const port = process.env.PORT || 3000;
        const host = '0.0.0.0';
        
        return new Promise((resolve, reject) => {
            const server = app.listen(port, host)
                .once('listening', () => {
                    console.log(`Server running on ${host}:${port}`);
                    resolve(server);
                })
                .once('error', (err) => {
                    console.error('Server failed to start:', err);
                    reject(err);
                });
        });
    } catch (error) {
        console.error('Server failed to start:', error);
        process.exit(1);
    }
};

// Start server
startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});


