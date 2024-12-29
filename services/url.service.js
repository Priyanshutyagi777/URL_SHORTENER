const Url = require('../models/url.model');
const { generateShortUrl } = require('../utils/url.utils');
const redisClient = require('../config/redis.config');
const { CACHE } = require('../config/constants');

class UrlService {
  async createShortUrl(longUrl, userId, topic = null) {
    const alias = generateShortUrl();
    const shortUrl = `${process.env.BASE_URL}/${alias}`;

    const url = await Url.create({
      longUrl,
      shortUrl,
      alias,
      topic,
      userId
    });

    // Cache the URL
    await redisClient.set(alias, longUrl, 'EX', CACHE.URL_EXPIRY);

    return url;
  }

  async findByAlias(alias) {
    // Try cache first
    const cachedUrl = await redisClient.get(alias);
    if (cachedUrl) return { longUrl: cachedUrl };

    // Fallback to database
    const url = await Url.findOne({ alias });
    if (url) {
      await redisClient.set(alias, url.longUrl, 'EX', CACHE.URL_EXPIRY);
    }

    return url;
  }
}

module.exports = new UrlService();