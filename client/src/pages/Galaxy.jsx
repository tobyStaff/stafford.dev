import { useState, useEffect, useRef } from 'react'
import * as Plot from '@observablehq/plot'
import { galaxyApiService } from '../services/galaxyApi'
import { prepareVisualizationData, TOPIC_COLORS } from '../utils/galaxyData'

const Galaxy = () => {
  const plotRef = useRef()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [apiError, setApiError] = useState(false)

  // Fetch predictions from the API
  const fetchPredictions = async () => {
    try {
      setLoading(true)
      setError(null)
      setApiError(false)

      // Try to fetch from API first
      const response = await galaxyApiService.fetchPredictions({ limit: 1000 })
      const stats = await galaxyApiService.fetchStatistics()

      setPredictions(response.predictions || [])
      setStatistics(stats)

      console.log('✅ Loaded predictions from API:', response.predictions?.length || 0)

    } catch (apiErr) {
      console.warn('⚠️ API failed, falling back to mock data:', apiErr.message)
      setApiError(true)

      // Fallback to mock data if API fails
      const mockPredictions = generateMockPredictions()
      setPredictions(mockPredictions)
      setStatistics(calculateMockStatistics(mockPredictions))
    } finally {
      setLoading(false)
    }
  }

  // Calculate mock statistics
  const calculateMockStatistics = (mockPredictions) => {
    const topicStats = mockPredictions.reduce((acc, pred) => {
      if (!acc[pred.topic]) {
        acc[pred.topic] = { count: 0, totalConfidence: 0 }
      }
      acc[pred.topic].count++
      acc[pred.topic].totalConfidence += pred.confidence
      return acc
    }, {})

    Object.keys(topicStats).forEach(topic => {
      topicStats[topic].avgConfidence = topicStats[topic].totalConfidence / topicStats[topic].count
    })

    return {
      totalPredictions: mockPredictions.length,
      topicBreakdown: topicStats,
      averageConfidence: mockPredictions.reduce((sum, p) => sum + p.confidence, 0) / mockPredictions.length,
      totalLikes: mockPredictions.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0),
    }
  }

  // Generate mock predictions as fallback (simplified version)
  const generateMockPredictions = () => {
    const topics = ['Technology', 'Politics', 'Economics', 'Sports', 'Entertainment', 'Science']
    const platforms = ['Twitter', 'Reddit', 'LinkedIn']

    const templates = [
      "AI will transform industry by 2026",
      "Company will dominate market by 2025",
      "The team will win the championship",
      "Climate change will impact region by 2027",
      "Platform will overtake competitors by 2025",
      "Politician will win the 2024 election"
    ]

    return Array.from({length: 30}, (_, i) => {
      const topic = topics[i % topics.length]
      const platform = platforms[i % platforms.length]
      const template = templates[i % templates.length]

      return {
        id: `mock-${i}`,
        content: template,
        author: {
          name: `@user${i}`,
          platform,
          handle: `@user${i}`,
        },
        topic,
        sentiment: (Math.random() - 0.5) * 2,
        confidence: Math.random() * 0.8 + 0.2,
        engagement: {
          likes: Math.floor(Math.random() * 1000) + 10,
          shares: Math.floor(Math.random() * 200) + 1,
          comments: Math.floor(Math.random() * 300) + 5,
        },
        coordinates: {
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      }
    })
  }

  // Load predictions on component mount
  useEffect(() => {
    fetchPredictions()
  }, [])

  // Update visualization when predictions change
  useEffect(() => {
    if (predictions.length > 0) {
      createPlot()
    }
  }, [predictions])

  // Create the visualization plot
  const createPlot = async () => {
    try {
      setError(null)

      if (!plotRef.current || predictions.length === 0) return

      // Clear previous plot
      plotRef.current.innerHTML = ''

      // Prepare data for visualization with clustering
      const visualizationData = prepareVisualizationData(predictions, {
        enableClustering: true,
      })

      // Generate background stars
      const stars = Array.from({length: 150}, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.2 + 0.3
      }))

      const plot = Plot.plot({
        width: 900,
        height: 600,
        marginTop: 40,
        marginRight: 40,
        marginBottom: 40,
        marginLeft: 40,
        style: {
          background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #000000 100%)',
          overflow: 'visible'
        },
        x: {
          domain: [0, 100],
          axis: null
        },
        y: {
          domain: [0, 100],
          axis: null
        },
        marks: [
          // Background stars
          Plot.dot(stars, {
            x: 'x',
            y: 'y',
            r: 'size',
            fill: '#ffffff',
            opacity: 0.3
          }),

          // Main prediction nodes with clustering
          Plot.dot(visualizationData.predictions, {
            x: d => d.coordinates.x,
            y: d => d.coordinates.y,
            r: d => 3 + (d.confidence * 6), // Size based on confidence
            fill: d => TOPIC_COLORS[d.topic] || '#6B7280',
            stroke: '#ffffff',
            strokeWidth: 0.5,
            opacity: 0.85,
            title: d => `${d.author.name} (${d.topic}):\n${d.content.slice(0, 120)}...\n\nConfidence: ${Math.round(d.confidence * 100)}%\nEngagement: ${d.engagement.likes} likes`
          })
        ]
      })

      plotRef.current.appendChild(plot)

    } catch (err) {
      console.error('Plot error:', err)
      setError(err.message)
    }
  }

  // Calculate display statistics
  const displayStats = statistics || {
    totalPredictions: predictions.length,
    averageConfidence: predictions.length > 0
      ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100)
      : 0,
    totalLikes: predictions.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0),
  }

  const topicCounts = predictions.reduce((acc, pred) => {
    acc[pred.topic] = (acc[pred.topic] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🌌 Galaxy of Predictions
          </h1>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">
            Explore social media predictions as an interactive constellation. Each node represents a prediction post,
            clustered by topic and sized by confidence level.
          </p>
          {apiError && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-900/50 rounded-lg border border-yellow-600/30">
              <span className="text-yellow-300 text-sm">⚠️ Using sample data - API unavailable</span>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <div className="flex gap-8 text-center">
              <div className="text-purple-300">
                <div className="text-xl font-bold text-white">{displayStats.totalPredictions}</div>
                <div className="text-sm">Predictions</div>
              </div>
              <div className="text-purple-300">
                <div className="text-xl font-bold text-white">
                  {Object.keys(topicCounts).length}
                </div>
                <div className="text-sm">Topics</div>
              </div>
              <div className="text-purple-300">
                <div className="text-xl font-bold text-white">
                  {displayStats.averageConfidence}%
                </div>
                <div className="text-sm">Avg Confidence</div>
              </div>
              <div className="text-purple-300">
                <div className="text-xl font-bold text-white">
                  {displayStats.totalLikes.toLocaleString()}
                </div>
                <div className="text-sm">Total Likes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Plot Container */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 overflow-x-auto">
            {loading && (
              <div className="flex items-center justify-center w-[900px] h-[600px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-purple-300">Loading galaxy visualization...</p>
                  <p className="text-sm text-purple-400 mt-2">Fetching predictions from API...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center w-[900px] h-[600px]">
                <div className="text-center text-red-400">
                  <p className="mb-2">⚠️ Error loading visualization</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <div
              ref={plotRef}
              className="min-w-[900px]"
              style={{ display: loading || error ? 'none' : 'block' }}
            />
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-3 text-center">Topics</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.entries(TOPIC_COLORS).map(([topic, color]) => {
                const topicCount = topicCounts[topic] || 0
                return (
                  <div key={topic} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border border-white/50"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-sm text-purple-200">{topic} ({topicCount})</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">How to Explore</h3>
            <div className="space-y-2 text-purple-200">
              <p>• Hover over nodes to see full prediction details in tooltips</p>
              <p>• Larger nodes indicate higher confidence predictions</p>
              <p>• Colors represent different topics/subjects</p>
              <p>• Nodes are clustered by topic similarity using smart algorithms</p>
              <p>• {predictions.length} predictions from social media platforms</p>
              <p>• Click functionality coming in future updates!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Galaxy