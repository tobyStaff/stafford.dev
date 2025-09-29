import * as d3 from 'd3';

/**
 * Galaxy Data Processing Utilities
 * Handles topic clustering, node positioning, and data normalization
 * for the Galaxy visualization
 */

// Topic clustering configuration
const TOPIC_CLUSTERS = {
  'Technology': { centerX: 20, centerY: 20, radius: 25 },
  'Politics': { centerX: 80, centerY: 20, radius: 25 },
  'Economics': { centerX: 20, centerY: 80, radius: 25 },
  'Sports': { centerX: 80, centerY: 80, radius: 25 },
  'Entertainment': { centerX: 50, centerY: 30, radius: 20 },
  'Science': { centerX: 50, centerY: 70, radius: 20 },
};

// Color mapping for topics (consistent with backend)
export const TOPIC_COLORS = {
  'Technology': '#3B82F6',
  'Politics': '#EF4444',
  'Economics': '#10B981',
  'Sports': '#F59E0B',
  'Entertainment': '#8B5CF6',
  'Science': '#14B8A6',
};

/**
 * Calculate clustered positions for predictions based on topic similarity
 * Uses force simulation to create natural-looking clusters
 */
export const calculateClusteredPositions = (predictions) => {
  if (!predictions || predictions.length === 0) {
    return [];
  }

  // Create a copy to avoid mutating original data
  const processedPredictions = predictions.map(prediction => ({
    ...prediction,
    // Initialize with cluster center positions
    x: TOPIC_CLUSTERS[prediction.topic]?.centerX || 50,
    y: TOPIC_CLUSTERS[prediction.topic]?.centerY || 50,
  }));

  // Set up D3 force simulation for clustering
  const simulation = d3.forceSimulation(processedPredictions)
    .force('collision', d3.forceCollide().radius(d => 3 + (d.confidence * 7) + 1))
    .force('center', d3.forceCenter(50, 50))
    .force('cluster', forceCluster())
    .force('x', d3.forceX(d => TOPIC_CLUSTERS[d.topic]?.centerX || 50).strength(0.3))
    .force('y', d3.forceY(d => TOPIC_CLUSTERS[d.topic]?.centerY || 50).strength(0.3))
    .stop();

  // Run simulation for a fixed number of ticks
  for (let i = 0; i < 300; ++i) {
    simulation.tick();
  }

  // Ensure all coordinates are within bounds (0-100)
  return processedPredictions.map(prediction => ({
    ...prediction,
    coordinates: {
      x: Math.max(0, Math.min(100, prediction.x)),
      y: Math.max(0, Math.min(100, prediction.y)),
    },
  }));
};

/**
 * Custom force for topic clustering
 * Keeps nodes close to their topic cluster centers
 */
function forceCluster() {
  let nodes;
  let strength = 0.5;

  function force(alpha) {
    for (const node of nodes) {
      const cluster = TOPIC_CLUSTERS[node.topic];
      if (!cluster) continue;

      const dx = cluster.centerX - node.x;
      const dy = cluster.centerY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Apply force towards cluster center, scaled by alpha and strength
      if (distance > 0) {
        const force = alpha * strength * Math.min(distance / cluster.radius, 1);
        node.vx += dx * force;
        node.vy += dy * force;
      }
    }
  }

  force.initialize = function(_) {
    nodes = _;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  return force;
}

/**
 * Normalize engagement metrics for visualization
 * Converts raw engagement numbers to 0-1 scale for consistent sizing
 */
export const normalizeEngagement = (predictions) => {
  if (!predictions || predictions.length === 0) {
    return [];
  }

  // Find min/max values for normalization
  const engagementScores = predictions.map(p =>
    (p.engagement.likes || 0) +
    (p.engagement.shares || 0) * 2 +
    (p.engagement.comments || 0) * 1.5
  );

  const minEngagement = Math.min(...engagementScores);
  const maxEngagement = Math.max(...engagementScores);
  const engagementRange = maxEngagement - minEngagement || 1;

  return predictions.map(prediction => {
    const engagementScore =
      (prediction.engagement.likes || 0) +
      (prediction.engagement.shares || 0) * 2 +
      (prediction.engagement.comments || 0) * 1.5;

    const normalizedEngagement = engagementRange > 0
      ? (engagementScore - minEngagement) / engagementRange
      : 0;

    return {
      ...prediction,
      normalizedEngagement,
      engagementScore,
    };
  });
};

/**
 * Filter predictions by various criteria
 */
export const filterPredictions = (predictions, filters = {}) => {
  if (!predictions || predictions.length === 0) {
    return [];
  }

  return predictions.filter(prediction => {
    // Topic filter
    if (filters.topics && filters.topics.length > 0) {
      if (!filters.topics.includes(prediction.topic)) {
        return false;
      }
    }

    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      if (!filters.platforms.includes(prediction.author.platform)) {
        return false;
      }
    }

    // Confidence range filter
    if (filters.confidenceRange) {
      const { min, max } = filters.confidenceRange;
      if (prediction.confidence < min || prediction.confidence > max) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const predictionDate = new Date(prediction.createdAt);
      const { start, end } = filters.dateRange;
      if (start && predictionDate < start) return false;
      if (end && predictionDate > end) return false;
    }

    // Text search filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const contentMatch = prediction.content.toLowerCase().includes(searchLower);
      const authorMatch = prediction.author.name.toLowerCase().includes(searchLower);
      if (!contentMatch && !authorMatch) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Calculate topic similarity matrix for clustering algorithms
 */
export const calculateTopicSimilarity = (predictions) => {
  const topics = [...new Set(predictions.map(p => p.topic))];
  const similarity = {};

  // Initialize similarity matrix
  topics.forEach(topic1 => {
    similarity[topic1] = {};
    topics.forEach(topic2 => {
      similarity[topic1][topic2] = topic1 === topic2 ? 1 : 0;
    });
  });

  // Calculate semantic similarity based on content overlap
  // This is a simplified approach - in production, you might use NLP libraries
  for (let i = 0; i < topics.length; i++) {
    for (let j = i + 1; j < topics.length; j++) {
      const topic1 = topics[i];
      const topic2 = topics[j];

      const predictions1 = predictions.filter(p => p.topic === topic1);
      const predictions2 = predictions.filter(p => p.topic === topic2);

      // Calculate word overlap (simplified semantic similarity)
      const words1 = new Set(
        predictions1
          .flatMap(p => p.content.toLowerCase().split(/\W+/))
          .filter(word => word.length > 3)
      );
      const words2 = new Set(
        predictions2
          .flatMap(p => p.content.toLowerCase().split(/\W+/))
          .filter(word => word.length > 3)
      );

      const intersection = new Set([...words1].filter(word => words2.has(word)));
      const union = new Set([...words1, ...words2]);
      const similarity_score = union.size > 0 ? intersection.size / union.size : 0;

      similarity[topic1][topic2] = similarity_score;
      similarity[topic2][topic1] = similarity_score;
    }
  }

  return similarity;
};

/**
 * Generate aggregated statistics for the visualization
 */
export const calculateGalaxyStatistics = (predictions) => {
  if (!predictions || predictions.length === 0) {
    return {
      totalPredictions: 0,
      topicStats: {},
      platformStats: {},
      confidenceStats: {},
      engagementStats: {},
    };
  }

  // Topic statistics
  const topicStats = predictions.reduce((acc, prediction) => {
    const topic = prediction.topic;
    if (!acc[topic]) {
      acc[topic] = {
        count: 0,
        totalConfidence: 0,
        totalEngagement: 0,
        predictions: [],
      };
    }

    acc[topic].count++;
    acc[topic].totalConfidence += prediction.confidence;
    acc[topic].totalEngagement +=
      (prediction.engagement.likes || 0) +
      (prediction.engagement.shares || 0) +
      (prediction.engagement.comments || 0);
    acc[topic].predictions.push(prediction);

    return acc;
  }, {});

  // Calculate averages for topics
  Object.keys(topicStats).forEach(topic => {
    const stats = topicStats[topic];
    stats.avgConfidence = stats.totalConfidence / stats.count;
    stats.avgEngagement = stats.totalEngagement / stats.count;
    stats.color = TOPIC_COLORS[topic] || '#6B7280';
  });

  // Platform statistics
  const platformStats = predictions.reduce((acc, prediction) => {
    const platform = prediction.author.platform;
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});

  // Confidence distribution
  const confidenceStats = {
    min: Math.min(...predictions.map(p => p.confidence)),
    max: Math.max(...predictions.map(p => p.confidence)),
    avg: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
    distribution: {
      low: predictions.filter(p => p.confidence < 0.33).length,
      medium: predictions.filter(p => p.confidence >= 0.33 && p.confidence < 0.66).length,
      high: predictions.filter(p => p.confidence >= 0.66).length,
    },
  };

  // Engagement statistics
  const totalLikes = predictions.reduce((sum, p) => sum + (p.engagement.likes || 0), 0);
  const totalShares = predictions.reduce((sum, p) => sum + (p.engagement.shares || 0), 0);
  const totalComments = predictions.reduce((sum, p) => sum + (p.engagement.comments || 0), 0);

  const engagementStats = {
    totalLikes,
    totalShares,
    totalComments,
    totalEngagement: totalLikes + totalShares + totalComments,
    avgLikes: totalLikes / predictions.length,
    avgShares: totalShares / predictions.length,
    avgComments: totalComments / predictions.length,
  };

  return {
    totalPredictions: predictions.length,
    topicStats,
    platformStats,
    confidenceStats,
    engagementStats,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Prepare data for Observable Plot visualization
 * Combines all processing steps into a single function
 */
export const prepareVisualizationData = (rawPredictions, options = {}) => {
  if (!rawPredictions || rawPredictions.length === 0) {
    return {
      predictions: [],
      statistics: calculateGalaxyStatistics([]),
      clusters: TOPIC_CLUSTERS,
    };
  }

  // Apply filters if provided
  let filteredPredictions = rawPredictions;
  if (options.filters) {
    filteredPredictions = filterPredictions(rawPredictions, options.filters);
  }

  // Normalize engagement metrics
  const normalizedPredictions = normalizeEngagement(filteredPredictions);

  // Calculate clustered positions if clustering is enabled
  let positionedPredictions = normalizedPredictions;
  if (options.enableClustering !== false) {
    positionedPredictions = calculateClusteredPositions(normalizedPredictions);
  }

  // Calculate statistics
  const statistics = calculateGalaxyStatistics(positionedPredictions);

  return {
    predictions: positionedPredictions,
    statistics,
    clusters: TOPIC_CLUSTERS,
    colors: TOPIC_COLORS,
  };
};