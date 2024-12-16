const { Redis } = require('@upstash/redis');
const { Ratelimit } = require('@upstash/ratelimit');

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
    automaticDeserialization: false
});

const rateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, "10s"),
    prefix: '@upstash/ratelimit',
}); 

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        const key = req.ip;
        const { success } = await rateLimit.limit(key);
        
        if (!success) {
            return res.status(429).json({ message: 'Too many requests' });
        }
        next();
    } catch (error) {
        // In production, you might want to allow the request rather than fail
        if (process.env.NODE_ENV === 'production') {
            next();
        } else {
            next(error);
        }
    }
};

module.exports = {
    rateLimiterMiddleware,
    redis
};
