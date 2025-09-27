const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Prediction = require('../models/Prediction');
const router = express.Router();

// Validation middleware helper
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// GET /api/galaxy/predictions - Fetch all predictions with optional filtering
router.get('/predictions', [
  query('topic').optional().isIn(['Technology', 'Politics', 'Economics', 'Sports', 'Entertainment', 'Science']),
  query('platform').optional().isIn(['Twitter', 'Reddit', 'LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'YouTube']),
  query('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  query('confidence_min').optional().isFloat({ min: 0, max: 1 }).toFloat(),
  query('confidence_max').optional().isFloat({ min: 0, max: 1 }).toFloat(),
  handleValidationErrors,
], async (req, res) => {
  try {
    const { topic, platform, limit = 100, offset = 0, confidence_min, confidence_max } = req.query;

    const whereConditions = { is_active: true };

    if (topic) {
      whereConditions.topic = topic;
    }

    if (platform) {
      whereConditions.author_platform = platform;
    }

    if (confidence_min !== undefined || confidence_max !== undefined) {
      whereConditions.confidence = {};
      if (confidence_min !== undefined) {
        whereConditions.confidence[Prediction.sequelize.Sequelize.Op.gte] = confidence_min;
      }
      if (confidence_max !== undefined) {
        whereConditions.confidence[Prediction.sequelize.Sequelize.Op.lte] = confidence_max;
      }
    }

    const predictions = await Prediction.getVisualizationData({
      where: whereConditions,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const totalCount = await Prediction.count({
      where: whereConditions,
    });

    res.json({
      predictions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });

  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// GET /api/galaxy/predictions/:id - Fetch single prediction by ID
router.get('/predictions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const prediction = await Prediction.findOne({
      where: {
        id,
        is_active: true,
      },
    });

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    res.json({
      prediction: prediction.toVisualizationData(),
    });

  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ error: 'Failed to fetch prediction' });
  }
});

// GET /api/galaxy/topics - Fetch available topics with statistics
router.get('/topics', async (req, res) => {
  try {
    const topicStats = await Prediction.getTopicStats();

    // Add color mapping for frontend
    const topicColors = {
      'Technology': '#3B82F6',
      'Politics': '#EF4444',
      'Economics': '#10B981',
      'Sports': '#F59E0B',
      'Entertainment': '#8B5CF6',
      'Science': '#14B8A6',
    };

    const topics = Object.entries(topicStats).map(([topic, stats]) => ({
      name: topic,
      color: topicColors[topic],
      ...stats,
    }));

    res.json({
      topics,
      totalPredictions: topics.reduce((sum, topic) => sum + topic.count, 0),
    });

  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// POST /api/galaxy/predictions - Create new prediction (for future use)
router.post('/predictions', [
  body('content').isLength({ min: 10, max: 2000 }).trim(),
  body('author_name').isLength({ min: 1, max: 100 }).trim(),
  body('author_handle').isLength({ min: 1, max: 100 }).trim(),
  body('author_platform').isIn(['Twitter', 'Reddit', 'LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'YouTube']),
  body('topic').isIn(['Technology', 'Politics', 'Economics', 'Sports', 'Entertainment', 'Science']),
  body('sentiment').isFloat({ min: -1, max: 1 }),
  body('confidence').isFloat({ min: 0, max: 1 }),
  body('x_coordinate').isFloat({ min: 0, max: 100 }),
  body('y_coordinate').isFloat({ min: 0, max: 100 }),
  body('subtopic').optional().isLength({ max: 100 }).trim(),
  body('likes').optional().isInt({ min: 0 }).toInt(),
  body('shares').optional().isInt({ min: 0 }).toInt(),
  body('comments').optional().isInt({ min: 0 }).toInt(),
  body('source_url').optional().isURL(),
  handleValidationErrors,
], async (req, res) => {
  try {
    const predictionData = req.body;

    const prediction = await Prediction.create(predictionData);

    res.status(201).json({
      message: 'Prediction created successfully',
      prediction: prediction.toVisualizationData(),
    });

  } catch (error) {
    console.error('Error creating prediction:', error);
    res.status(500).json({ error: 'Failed to create prediction' });
  }
});

// GET /api/galaxy/statistics - Get overall galaxy statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalPredictions = await Prediction.count({
      where: { is_active: true },
    });

    const topicStats = await Prediction.getTopicStats();

    const platformStats = await Prediction.findAll({
      attributes: [
        'author_platform',
        [Prediction.sequelize.fn('COUNT', Prediction.sequelize.col('id')), 'count'],
      ],
      where: { is_active: true },
      group: ['author_platform'],
      raw: true,
    });

    const confidenceAvg = await Prediction.findOne({
      attributes: [
        [Prediction.sequelize.fn('AVG', Prediction.sequelize.col('confidence')), 'avg_confidence'],
        [Prediction.sequelize.fn('SUM', Prediction.sequelize.col('likes')), 'total_likes'],
      ],
      where: { is_active: true },
      raw: true,
    });

    res.json({
      totalPredictions,
      totalTopics: Object.keys(topicStats).length,
      averageConfidence: parseFloat(confidenceAvg.avg_confidence) || 0,
      totalLikes: parseInt(confidenceAvg.total_likes) || 0,
      topicBreakdown: topicStats,
      platformBreakdown: platformStats.reduce((acc, stat) => {
        acc[stat.author_platform] = parseInt(stat.count);
        return acc;
      }, {}),
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Galaxy data endpoint
router.get('/data', async (req, res) => {
  try {
    // Simulate some galaxy data - could be replaced with real astronomical data
    const galaxyData = {
      visitCount: Math.floor(Math.random() * 1000) + 1000,
      starCount: 400000000000, // Estimated stars in Milky Way
      planets: [
        {
          name: 'Kepler-452b',
          distance: '1,400 light years',
          type: 'Super-Earth',
          habitable: true
        },
        {
          name: 'HD 209458 b',
          distance: '159 light years',
          type: 'Hot Jupiter',
          habitable: false
        },
        {
          name: 'TRAPPIST-1e',
          distance: '40 light years',
          type: 'Terrestrial',
          habitable: true
        }
      ],
      facts: [
        'The Milky Way is approximately 13.6 billion years old',
        'Our galaxy contains an estimated 400 billion stars',
        'The supermassive black hole at our galaxy\'s center is called Sagittarius A*',
        'It takes the Sun about 225-250 million years to orbit the galactic center',
        'The nearest major galaxy to us is Andromeda, 2.5 million light years away'
      ]
    };

    res.json(galaxyData);
  } catch (error) {
    console.error('Galaxy data error:', error);
    res.status(500).json({ error: 'Failed to fetch galaxy data' });
  }
});

// Random cosmic fact endpoint
router.get('/cosmic-fact', async (req, res) => {
  try {
    const cosmicFacts = [
      'A day on Venus is longer than its year',
      'One million Earths could fit inside the Sun',
      'Neutron stars can spin 600 times per second',
      'The observable universe contains over 2 trillion galaxies',
      'Jupiter has 95 known moons as of 2023',
      'Saturn\'s moon Titan has lakes of liquid methane',
      'The coldest place in the universe is the Boomerang Nebula at -272°C'
    ];

    const randomFact = cosmicFacts[Math.floor(Math.random() * cosmicFacts.length)];
    res.json({ fact: randomFact });
  } catch (error) {
    console.error('Cosmic fact error:', error);
    res.status(500).json({ error: 'Failed to fetch cosmic fact' });
  }
});

module.exports = router;