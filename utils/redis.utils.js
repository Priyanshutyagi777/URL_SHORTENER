const { createClient } = require('redis');

let client = null;
let isRedisAvailable = false;
let connectionRetries = 0;
const MAX_RETRIES = 3;

const getRedisClient = async () => {
  if (!client) {
    try {
      // Use localhost for local development
      const redisUrl = process.env.NODE_ENV === 'production' 
        ? process.env.REDIS_URL 
        : 'redis://localhost:6379';

      client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            connectionRetries = retries;
            if (retries >= MAX_RETRIES) {
              console.warn('Max Redis connection retries reached, continuing without Redis');
              isRedisAvailable = false;
              return false; // stop retrying
            }
            return Math.min(retries * 100, 3000); // exponential backoff
          }
        }
      });

      client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        isRedisAvailable = false;
      });

      client.on('connect', () => {
        console.log('Redis Client Connected');
        isRedisAvailable = true;
        connectionRetries = 0;
      });

      await client.connect();
    } catch (error) {
      console.warn('Redis connection failed, continuing without Redis:', error.message);
      isRedisAvailable = false;
      client = null;
    }
  }
  return client;
};

const getRedisStatus = () => isRedisAvailable;

module.exports = {
  getRedisClient,
  getRedisStatus
};