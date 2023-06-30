const Redis = require('ioredis');
const redis = new Redis(process.env.REDISS_URL);


const rateLimitMiddleware = async (req, res, next) => {
    clientIp = req.ip;

    try {
        // Define the rate limit settings
        const rateLimitKey = `rateLimit:${clientIp}`;
        const windowSeconds = 3600; // Fixed window of 60 seconds
        const maxRequests = 100; // Maximum requests allowed within the window

        const currentRequests = await redis.incr(rateLimitKey);

        // Check if the number of requests exceeds the limit
        if (currentRequests > maxRequests) {
            return res.status(429).json({ error: 'Rate limit exceeded try after sometime' });
        }

        // Set the expiration time for the rate limit key
        if (currentRequests === 1) {
            await redis.expire(rateLimitKey, windowSeconds);
        }

        next(); // Proceed with the next middleware/route handler
    } catch (error) {
        console.error('Rate limiting error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = rateLimitMiddleware;