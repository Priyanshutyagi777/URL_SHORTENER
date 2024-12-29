const { createClient } = require('redis');

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: false // Disable auto-reconnect
  }
};

const createRedisClient = () => {
  const client = createClient(redisConfig);
  
  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    console.log('Redis Client Connected');
  });

  return client;
};

module.exports = {
  createRedisClient,
  redisConfig
};