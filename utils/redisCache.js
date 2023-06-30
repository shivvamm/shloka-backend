const Redis = require('ioredis');
const redis = new Redis(process.env.REDISS_URL);




// Helper function to get data from cache
const getDataFromCache = async (key) => {
    const cachedData = await redis.get(key);
    return JSON.parse(cachedData);
}

// Helper function to set data in cache with an expiration time
const setDataInCache = async (key, data, expirationTime) => {
    await redis.set(key, JSON.stringify(data), 'EX', expirationTime);
}

module.exports = { getDataFromCache, setDataInCache };