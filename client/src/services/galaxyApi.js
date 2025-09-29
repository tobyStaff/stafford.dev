import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://stafford.dev/api'
  : '/api';

// Create axios instance with default configuration
const galaxyApi = axios.create({
  baseURL: `${API_BASE_URL}/galaxy`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging in development
if (process.env.NODE_ENV === 'development') {
  galaxyApi.interceptors.request.use(
    (config) => {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.params || config.data);
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );
}

// Response interceptor for error handling
galaxyApi.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url,
    });

    // Transform error for consistent handling
    const apiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.error || error.message || 'Network error',
      details: error.response?.data?.details || null,
    };

    return Promise.reject(apiError);
  }
);

/**
 * Galaxy API Service
 * Provides methods to interact with the galaxy prediction endpoints
 */
export const galaxyApiService = {
  /**
   * Fetch all predictions with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.topic - Filter by topic
   * @param {string} params.platform - Filter by platform
   * @param {number} params.limit - Number of results per page (default: 100)
   * @param {number} params.offset - Number of results to skip (default: 0)
   * @param {number} params.confidence_min - Minimum confidence level (0-1)
   * @param {number} params.confidence_max - Maximum confidence level (0-1)
   * @returns {Promise<Object>} Response with predictions and pagination info
   */
  async fetchPredictions(params = {}) {
    const response = await galaxyApi.get('/predictions', { params });
    return response.data;
  },

  /**
   * Fetch a single prediction by ID
   * @param {string} id - Prediction ID
   * @returns {Promise<Object>} Prediction data
   */
  async fetchPredictionById(id) {
    const response = await galaxyApi.get(`/predictions/${id}`);
    return response.data;
  },

  /**
   * Fetch topic statistics and information
   * @returns {Promise<Object>} Topics with statistics and colors
   */
  async fetchTopics() {
    const response = await galaxyApi.get('/topics');
    return response.data;
  },

  /**
   * Fetch comprehensive galaxy statistics
   * @returns {Promise<Object>} Overall statistics and analytics
   */
  async fetchStatistics() {
    const response = await galaxyApi.get('/statistics');
    return response.data;
  },

  /**
   * Create a new prediction
   * @param {Object} predictionData - Prediction data to create
   * @returns {Promise<Object>} Created prediction data
   */
  async createPrediction(predictionData) {
    const response = await galaxyApi.post('/predictions', predictionData);
    return response.data;
  },

  /**
   * Fetch predictions with advanced filtering options
   * @param {Object} filters - Advanced filter options
   * @param {string[]} filters.topics - Array of topics to include
   * @param {string[]} filters.platforms - Array of platforms to include
   * @param {Object} filters.confidenceRange - {min: number, max: number}
   * @param {Object} filters.dateRange - {start: Date, end: Date}
   * @param {string} filters.searchText - Text to search in content/author
   * @param {number} filters.limit - Results limit
   * @param {number} filters.offset - Results offset
   * @returns {Promise<Object>} Filtered predictions
   */
  async fetchFilteredPredictions(filters) {
    const params = {};

    // Convert array filters to API format
    if (filters.topics && filters.topics.length > 0) {
      // For multiple topics, make multiple requests and combine
      // Or modify backend to accept comma-separated topics
      params.topic = filters.topics[0]; // Simplified for now
    }

    if (filters.platforms && filters.platforms.length > 0) {
      params.platform = filters.platforms[0]; // Simplified for now
    }

    if (filters.confidenceRange) {
      params.confidence_min = filters.confidenceRange.min;
      params.confidence_max = filters.confidenceRange.max;
    }

    if (filters.limit) params.limit = filters.limit;
    if (filters.offset) params.offset = filters.offset;

    // For date range and text search, we'll handle on frontend for now
    // In production, these would be implemented on the backend
    const response = await this.fetchPredictions(params);

    // Apply frontend filtering for features not yet supported by backend
    let predictions = response.predictions;

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      predictions = predictions.filter(p =>
        p.content.toLowerCase().includes(searchLower) ||
        p.author.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      predictions = predictions.filter(p => {
        const predictionDate = new Date(p.createdAt);
        if (start && predictionDate < start) return false;
        if (end && predictionDate > end) return false;
        return true;
      });
    }

    return {
      ...response,
      predictions,
      filteredCount: predictions.length,
    };
  },

  /**
   * Health check for the galaxy API
   * @returns {Promise<boolean>} API availability status
   */
  async healthCheck() {
    try {
      await galaxyApi.get('/statistics');
      return true;
    } catch (error) {
      console.warn('Galaxy API health check failed:', error.message);
      return false;
    }
  },
};

// Export individual methods for convenience
export const {
  fetchPredictions,
  fetchPredictionById,
  fetchTopics,
  fetchStatistics,
  createPrediction,
  fetchFilteredPredictions,
  healthCheck,
} = galaxyApiService;

export default galaxyApiService;