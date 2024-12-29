const Analytics = require('../models/analytics.model');
const UAParser = require('ua-parser-js');

class AnalyticsService {
  async logVisit(urlId, req) {
    const parser = new UAParser(req.headers['user-agent']);
    
    return Analytics.create({
      urlId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      osType: parser.getOS().name,
      deviceType: parser.getDevice().type || 'desktop',
      visitorId: req.headers['x-visitor-id']
    });
  }

  async getUrlStats(urlId) {
    return Analytics.aggregate([
      { $match: { urlId } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueClicks: { $addToSet: '$visitorId' }
        }
      }
    ]);
  }
}

module.exports = new AnalyticsService();