const Url = require('../models/url.model');
const Analytics = require('../models/analytics.model');
const { generateShortUrl } = require('../utils/url.utils');
const { cacheUrl, getCachedUrl } = require('../utils/redis.utils');
const UAParser = require('ua-parser-js');

exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user.id;

    const alias = customAlias || generateShortUrl();
    
    const url = new Url({
      longUrl,
      shortUrl: `${process.env.BASE_URL}/${alias}`,
      alias,
      topic,
      userId
    });

    await url.save();
    await cacheUrl(alias, longUrl);

    res.status(201).json({
      shortUrl: url.shortUrl,
      createdAt: url.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    let longUrl = await getCachedUrl(alias);
    let url;
    
    if (!longUrl) {
      url = await Url.findOne({ alias });
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
      longUrl = url.longUrl;
      await cacheUrl(alias, longUrl);
    }

    // Log analytics
    const parser = new UAParser(req.headers['user-agent']);
    const analytics = new Analytics({
      urlId: url._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      osType: parser.getOS().name,
      deviceType: parser.getDevice().type || 'desktop',
      visitorId: req.headers['x-visitor-id']
    });
    
    await analytics.save();
    res.redirect(longUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};