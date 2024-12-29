const { getRedisClient, getRedisStatus } = require('../utils/redis.utils');

class CacheService {
  constructor() {
    this.initialize();
  }

  async initialize() {
    await getRedisClient();
  }

  async set(key, value, expiry = 86400) {
    if (!getRedisStatus()) return;
    
    try {
      const client = await getRedisClient();
      await client.set(key, value, 'EX', expiry);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get(key) {
    if (!getRedisStatus()) return null;
    
    try {
      const client = await getRedisClient();
      return await client.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
}

module.exports = new CacheService();