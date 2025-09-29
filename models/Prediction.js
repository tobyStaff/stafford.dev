const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prediction = sequelize.define('Prediction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },

  // Content fields
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000], // Reasonable limits for prediction content
    },
  },

  // Author information
  author_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },

  author_handle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },

  author_platform: {
    type: DataTypes.ENUM('Twitter', 'Reddit', 'LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'YouTube'),
    allowNull: false,
  },

  // Categorization
  topic: {
    type: DataTypes.ENUM('Technology', 'Politics', 'Economics', 'Sports', 'Entertainment', 'Science'),
    allowNull: false,
  },

  subtopic: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  // Prediction metrics
  sentiment: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: -1.0,
      max: 1.0,
    },
  },

  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0.0,
      max: 1.0,
    },
  },

  // Engagement metrics
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
    },
  },

  shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
    },
  },

  comments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
    },
  },

  // Prediction details
  prediction_subject: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  prediction_outcome: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

  prediction_timeframe: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  // Visualization coordinates
  x_coordinate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  y_coordinate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  // Source information
  source_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },

  // Status and metadata
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },

  verification_status: {
    type: DataTypes.ENUM('unverified', 'verified', 'disputed'),
    defaultValue: 'unverified',
    allowNull: false,
  },

}, {
  // Model options
  tableName: 'predictions',
  timestamps: true,
  paranoid: true, // Soft deletes
  underscored: true,

  // Indexes for performance
  indexes: [
    {
      fields: ['topic'],
    },
    {
      fields: ['author_platform'],
    },
    {
      fields: ['is_active'],
    },
    {
      fields: ['verification_status'],
    },
    {
      fields: ['created_at'],
    },
    {
      fields: ['confidence'],
    },
    {
      fields: ['sentiment'],
    },
    // Composite indexes for common queries
    {
      fields: ['topic', 'is_active'],
    },
    {
      fields: ['author_platform', 'topic'],
    },
  ],

  // Hooks for data processing
  hooks: {
    beforeCreate: async (prediction) => {
      // Normalize text content
      prediction.content = prediction.content.trim();
      prediction.author_name = prediction.author_name.trim();
      prediction.author_handle = prediction.author_handle.trim();

      // Ensure coordinates are within expected bounds (0-100)
      prediction.x_coordinate = Math.max(0, Math.min(100, prediction.x_coordinate));
      prediction.y_coordinate = Math.max(0, Math.min(100, prediction.y_coordinate));
    },

    beforeUpdate: async (prediction) => {
      if (prediction.changed('content')) {
        prediction.content = prediction.content.trim();
      }
      if (prediction.changed('author_name')) {
        prediction.author_name = prediction.author_name.trim();
      }
      if (prediction.changed('author_handle')) {
        prediction.author_handle = prediction.author_handle.trim();
      }
      if (prediction.changed('x_coordinate')) {
        prediction.x_coordinate = Math.max(0, Math.min(100, prediction.x_coordinate));
      }
      if (prediction.changed('y_coordinate')) {
        prediction.y_coordinate = Math.max(0, Math.min(100, prediction.y_coordinate));
      }
    },
  },
});

// Instance methods
Prediction.prototype.getEngagementScore = function() {
  // Calculate a composite engagement score
  return (this.likes * 1) + (this.shares * 2) + (this.comments * 1.5);
};

Prediction.prototype.toVisualizationData = function() {
  // Return data formatted for the visualization
  return {
    id: this.id,
    content: this.content,
    author: {
      name: this.author_name,
      platform: this.author_platform,
      handle: this.author_handle,
    },
    topic: this.topic,
    subtopic: this.subtopic,
    sentiment: this.sentiment,
    confidence: this.confidence,
    engagement: {
      likes: this.likes,
      shares: this.shares,
      comments: this.comments,
    },
    prediction: {
      subject: this.prediction_subject,
      outcome: this.prediction_outcome,
      timeframe: this.prediction_timeframe,
    },
    coordinates: {
      x: this.x_coordinate,
      y: this.y_coordinate,
    },
    createdAt: this.created_at,
    sourceUrl: this.source_url,
  };
};

// Class methods
Prediction.findByTopic = async function(topic, options = {}) {
  return await this.findAll({
    where: {
      topic,
      is_active: true,
      ...options.where,
    },
    order: options.order || [['created_at', 'DESC']],
    limit: options.limit,
    offset: options.offset,
  });
};

Prediction.findByPlatform = async function(platform, options = {}) {
  return await this.findAll({
    where: {
      author_platform: platform,
      is_active: true,
      ...options.where,
    },
    order: options.order || [['created_at', 'DESC']],
    limit: options.limit,
    offset: options.offset,
  });
};

Prediction.getTopicStats = async function() {
  const stats = await this.findAll({
    attributes: [
      'topic',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('AVG', sequelize.col('confidence')), 'avg_confidence'],
      [sequelize.fn('AVG', sequelize.col('sentiment')), 'avg_sentiment'],
    ],
    where: {
      is_active: true,
    },
    group: ['topic'],
    raw: true,
  });

  return stats.reduce((acc, stat) => {
    acc[stat.topic] = {
      count: parseInt(stat.count),
      avgConfidence: parseFloat(stat.avg_confidence),
      avgSentiment: parseFloat(stat.avg_sentiment),
    };
    return acc;
  }, {});
};

Prediction.getVisualizationData = async function(options = {}) {
  const predictions = await this.findAll({
    where: {
      is_active: true,
      ...options.where,
    },
    order: options.order || [['created_at', 'DESC']],
    limit: options.limit || 1000, // Default limit to prevent overwhelming the visualization
    offset: options.offset,
  });

  return predictions.map(prediction => prediction.toVisualizationData());
};

module.exports = Prediction;