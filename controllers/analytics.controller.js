const Analytics = require('../models/analytics.model');
const Url = require('../models/url.model');

exports.getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    const url = await Url.findOne({ alias });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const analytics = await Analytics.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueClicks: { $addToSet: '$visitorId' },
          clicksByDate: {
            $push: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              count: 1
            }
          },
          osTypes: { $addToSet: '$osType' },
          deviceTypes: { $addToSet: '$deviceType' }
        }
      }
    ]);

    res.json({
      totalClicks: analytics[0].totalClicks,
      uniqueClicks: analytics[0].uniqueClicks.length,
      clicksByDate: analytics[0].clicksByDate,
      osType: analytics[0].osTypes,
      deviceType: analytics[0].deviceTypes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;
    const urls = await Url.find({ topic, userId: req.user.id });
    
    const urlIds = urls.map(url => url._id);
    
    const analytics = await Analytics.aggregate([
      { $match: { urlId: { $in: urlIds } } },
      {
        $group: {
          _id: '$urlId',
          totalClicks: { $sum: 1 },
          uniqueClicks: { $addToSet: '$visitorId' }
        }
      }
    ]);

    res.json({
      totalClicks: analytics.reduce((sum, item) => sum + item.totalClicks, 0),
      uniqueClicks: analytics.reduce((sum, item) => sum + item.uniqueClicks.length, 0),
      urls: analytics.map(item => ({
        shortUrl: urls.find(url => url._id.equals(item._id)).shortUrl,
        totalClicks: item.totalClicks,
        uniqueClicks: item.uniqueClicks.length
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOverallAnalytics = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id });
    const urlIds = urls.map(url => url._id);
    
    const analytics = await Analytics.aggregate([
      { $match: { urlId: { $in: urlIds } } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueClicks: { $addToSet: '$visitorId' },
          osTypes: {
            $push: {
              osName: '$osType',
              visitorId: '$visitorId'
            }
          },
          deviceTypes: {
            $push: {
              deviceName: '$deviceType',
              visitorId: '$visitorId'
            }
          }
        }
      }
    ]);

    res.json({
      totalUrls: urls.length,
      totalClicks: analytics[0].totalClicks,
      uniqueClicks: analytics[0].uniqueClicks.length,
      osType: processTypeStats(analytics[0].osTypes),
      deviceType: processTypeStats(analytics[0].deviceTypes)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};