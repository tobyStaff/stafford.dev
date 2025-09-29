import { useState, useEffect, useRef } from 'react'
import * as Plot from '@observablehq/plot'
import * as d3 from 'd3'
import { galaxyApiService } from '../services/galaxyApi'
import { prepareVisualizationData, TOPIC_COLORS } from '../utils/galaxyData'
import PostModal from '../components/PostModal'

const Galaxy = () => {
  const plotRef = useRef()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [apiError, setApiError] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // Generate mock predictions as fallback with diverse content for clustering
  const generateMockPredictions = () => {
    const predictionData = [
      // Technology predictions
      { topic: 'Technology', content: 'AI will achieve AGI by 2027, revolutionizing every industry', author: '@tech_prophet', platform: 'Twitter', sentiment: 0.8, confidence: 0.75 },
      { topic: 'Technology', content: 'Quantum computing will break current encryption by 2026', author: '@quantum_dev', platform: 'LinkedIn', sentiment: -0.2, confidence: 0.85 },
      { topic: 'Technology', content: 'Tesla will release fully autonomous robotaxis in 2025', author: '@auto_insider', platform: 'Twitter', sentiment: 0.9, confidence: 0.65 },
      { topic: 'Technology', content: 'Apple will launch AR glasses that replace smartphones', author: '@apple_watcher', platform: 'Reddit', sentiment: 0.7, confidence: 0.60 },
      { topic: 'Technology', content: 'Web3 and NFTs will make a major comeback in 2025', author: '@crypto_bull', platform: 'Twitter', sentiment: 0.6, confidence: 0.45 },
      { topic: 'Technology', content: 'Meta will shut down metaverse projects by end of 2025', author: '@meta_critic', platform: 'Reddit', sentiment: -0.5, confidence: 0.70 },
      { topic: 'Technology', content: 'OpenAI will be valued at $500B after next funding round', author: '@ai_investor', platform: 'LinkedIn', sentiment: 0.8, confidence: 0.55 },
      { topic: 'Technology', content: 'Neural interfaces will allow direct brain-computer communication', author: '@neuralink_fan', platform: 'Twitter', sentiment: 0.9, confidence: 0.40 },

      // Politics predictions
      { topic: 'Politics', content: 'Biden will not run for re-election in 2024', author: '@political_analyst', platform: 'Twitter', sentiment: 0.1, confidence: 0.80 },
      { topic: 'Politics', content: 'Trump will win the Republican primary by large margin', author: '@gop_insider', platform: 'Twitter', sentiment: 0.3, confidence: 0.75 },
      { topic: 'Politics', content: 'A third party candidate will get 15% of vote in 2024', author: '@independent_voice', platform: 'Reddit', sentiment: 0.5, confidence: 0.35 },
      { topic: 'Politics', content: 'Supreme Court will overturn more precedents in 2025', author: '@legal_scholar', platform: 'LinkedIn', sentiment: -0.4, confidence: 0.65 },
      { topic: 'Politics', content: 'Congress will pass major immigration reform bill', author: '@dc_lobbyist', platform: 'Twitter', sentiment: 0.4, confidence: 0.30 },
      { topic: 'Politics', content: 'China and Taiwan tensions will escalate significantly', author: '@foreign_policy', platform: 'LinkedIn', sentiment: -0.8, confidence: 0.70 },
      { topic: 'Politics', content: 'EU will impose major new regulations on Big Tech', author: '@eu_watcher', platform: 'Twitter', sentiment: 0.2, confidence: 0.85 },
      { topic: 'Politics', content: 'Russia-Ukraine war will end with negotiated settlement', author: '@war_correspondent', platform: 'Reddit', sentiment: 0.6, confidence: 0.50 },

      // Economics predictions
      { topic: 'Economics', content: 'Federal Reserve will cut rates 3 times in 2025', author: '@fed_watcher', platform: 'LinkedIn', sentiment: 0.7, confidence: 0.60 },
      { topic: 'Economics', content: 'US will enter recession in Q2 2025', author: '@bear_economist', platform: 'Twitter', sentiment: -0.9, confidence: 0.45 },
      { topic: 'Economics', content: 'Bitcoin will reach $200,000 by end of 2025', author: '@bitcoin_maxi', platform: 'Reddit', sentiment: 0.9, confidence: 0.40 },
      { topic: 'Economics', content: 'Housing prices will drop 20% in major cities', author: '@real_estate_bear', platform: 'LinkedIn', sentiment: -0.3, confidence: 0.55 },
      { topic: 'Economics', content: 'Inflation will return to 2% target by mid-2025', author: '@macro_bull', platform: 'Twitter', sentiment: 0.8, confidence: 0.70 },
      { topic: 'Economics', content: 'GameStop will squeeze again and reach $500', author: '@ape_trader', platform: 'Reddit', sentiment: 0.9, confidence: 0.25 },
      { topic: 'Economics', content: 'Dollar will lose reserve currency status by 2030', author: '@dedollarization', platform: 'Twitter', sentiment: -0.6, confidence: 0.35 },
      { topic: 'Economics', content: 'Tesla stock will hit $1000 after robotaxi launch', author: '@tsla_bull', platform: 'Reddit', sentiment: 0.8, confidence: 0.50 },

      // Sports predictions
      { topic: 'Sports', content: 'Chiefs will win their third consecutive Super Bowl', author: '@nfl_insider', platform: 'Twitter', sentiment: 0.8, confidence: 0.60 },
      { topic: 'Sports', content: 'LeBron James will retire after this NBA season', author: '@basketball_news', platform: 'Twitter', sentiment: 0.2, confidence: 0.55 },
      { topic: 'Sports', content: 'Messi will lead Inter Miami to MLS Cup victory', author: '@mls_fan', platform: 'Reddit', sentiment: 0.9, confidence: 0.65 },
      { topic: 'Sports', content: 'Manchester City will be relegated due to charges', author: '@epl_analyst', platform: 'Twitter', sentiment: -0.5, confidence: 0.30 },
      { topic: 'Sports', content: 'Connor Bedard will win Rookie of the Year in NHL', author: '@hockey_scout', platform: 'Reddit', sentiment: 0.7, confidence: 0.80 },
      { topic: 'Sports', content: 'Dodgers will win World Series with Ohtani and Yamamoto', author: '@baseball_fan', platform: 'Twitter', sentiment: 0.8, confidence: 0.55 },
      { topic: 'Sports', content: 'Jon Jones will retire undefeated from UFC', author: '@mma_expert', platform: 'Reddit', sentiment: 0.6, confidence: 0.40 },
      { topic: 'Sports', content: 'Tiger Woods will win one more major championship', author: '@golf_legend', platform: 'Twitter', sentiment: 0.5, confidence: 0.25 },

      // Entertainment predictions
      { topic: 'Entertainment', content: 'Taylor Swift will announce retirement from touring', author: '@pop_insider', platform: 'Twitter', sentiment: -0.2, confidence: 0.30 },
      { topic: 'Entertainment', content: 'Disney will acquire another major streaming service', author: '@media_mogul', platform: 'LinkedIn', sentiment: 0.4, confidence: 0.60 },
      { topic: 'Entertainment', content: 'Marvel will reboot X-Men with entirely new cast', author: '@comic_leaker', platform: 'Reddit', sentiment: 0.3, confidence: 0.70 },
      { topic: 'Entertainment', content: 'Netflix will launch live sports programming', author: '@streaming_analyst', platform: 'LinkedIn', sentiment: 0.6, confidence: 0.80 },
      { topic: 'Entertainment', content: 'TikTok will be banned in US before 2026', author: '@social_policy', platform: 'Twitter', sentiment: -0.4, confidence: 0.65 },
      { topic: 'Entertainment', content: 'AI will create a top 10 hit song completely autonomously', author: '@music_tech', platform: 'Reddit', sentiment: 0.2, confidence: 0.55 },
      { topic: 'Entertainment', content: 'Traditional TV viewership will drop below streaming', author: '@cord_cutter', platform: 'Twitter', sentiment: 0.7, confidence: 0.90 },
      { topic: 'Entertainment', content: 'Virtual concerts will generate $1B in revenue', author: '@metaverse_music', platform: 'LinkedIn', sentiment: 0.8, confidence: 0.45 },

      // Science predictions
      { topic: 'Science', content: 'JWST will discover definitive signs of alien life', author: '@space_scientist', platform: 'Twitter', sentiment: 0.9, confidence: 0.25 },
      { topic: 'Science', content: 'Fusion power will achieve net energy gain consistently', author: '@fusion_researcher', platform: 'LinkedIn', sentiment: 0.8, confidence: 0.60 },
      { topic: 'Science', content: 'COVID-19 will be declared officially endemic', author: '@epidemiologist', platform: 'Twitter', sentiment: 0.5, confidence: 0.75 },
      { topic: 'Science', content: 'Gene therapy will cure Type 1 diabetes', author: '@biotech_investor', platform: 'Reddit', sentiment: 0.9, confidence: 0.40 },
      { topic: 'Science', content: 'Mars mission will be delayed beyond 2030', author: '@nasa_critic', platform: 'Twitter', sentiment: -0.3, confidence: 0.70 },
      { topic: 'Science', content: 'Alzheimer\'s will be preventable with new drug', author: '@neuro_researcher', platform: 'LinkedIn', sentiment: 0.9, confidence: 0.35 },
      { topic: 'Science', content: 'Climate change will trigger massive migration crisis', author: '@climate_scientist', platform: 'Twitter', sentiment: -0.8, confidence: 0.85 },
      { topic: 'Science', content: 'Lab-grown meat will be cheaper than real meat', author: '@food_tech', platform: 'Reddit', sentiment: 0.7, confidence: 0.50 },

      // Additional diverse predictions to reach 50
      { topic: 'Technology', content: 'Robotics will replace 50% of warehouse jobs', author: '@automation_expert', platform: 'LinkedIn', sentiment: -0.1, confidence: 0.80 },
      { topic: 'Politics', content: 'Universal Basic Income pilot will launch in 5 states', author: '@ubi_advocate', platform: 'Reddit', sentiment: 0.8, confidence: 0.45 },
      { topic: 'Economics', content: 'Central Bank Digital Currencies will launch globally', author: '@fintech_analyst', platform: 'LinkedIn', sentiment: 0.3, confidence: 0.75 },
      { topic: 'Sports', content: 'Olympics will feature esports as official medal event', author: '@esports_pioneer', platform: 'Twitter', sentiment: 0.9, confidence: 0.50 },
      { topic: 'Entertainment', content: 'Holographic concerts will become mainstream', author: '@tech_artist', platform: 'Reddit', sentiment: 0.6, confidence: 0.40 },
      { topic: 'Science', content: 'Quantum internet will connect major research centers', author: '@quantum_engineer', platform: 'LinkedIn', sentiment: 0.8, confidence: 0.55 },
    ]

    return predictionData.map((item, i) => ({
      id: `mock-${i}`,
      content: item.content,
      author: {
        name: item.author,
        platform: item.platform,
        handle: item.author,
      },
      topic: item.topic,
      sentiment: item.sentiment,
      confidence: item.confidence,
      engagement: {
        likes: Math.floor(Math.random() * 5000) + 100,
        shares: Math.floor(Math.random() * 800) + 10,
        comments: Math.floor(Math.random() * 500) + 20,
      },
      coordinates: {
        x: Math.random() * 100,
        y: Math.random() * 100,
      },
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    }))
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

  // Handle prediction node click
  const handlePredictionClick = (prediction) => {
    setSelectedPrediction(prediction)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPrediction(null)
  }

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
            title: d => `${d.author.name} (${d.topic}):\n${d.content.slice(0, 120)}...\n\nConfidence: ${Math.round(d.confidence * 100)}%\nEngagement: ${d.engagement.likes} likes\n\nClick to view full details`,
            cursor: 'pointer'
          })
        ]
      })

      plotRef.current.appendChild(plot)

      // Add click event listeners to prediction nodes (circles)
      // Observable Plot creates circles inside the SVG, so we target them directly
      const circles = plot.querySelectorAll('circle')
      console.log('Found circles:', circles.length)

      // Filter out background stars (first 150 circles) and target only prediction nodes
      const predictionCircles = Array.from(circles).slice(150) // Skip the 150 star circles
      console.log('Prediction circles:', predictionCircles.length)

      predictionCircles.forEach((circle, index) => {
        if (index < visualizationData.predictions.length) {
          circle.style.cursor = 'pointer'
          circle.addEventListener('click', (event) => {
            event.stopPropagation()
            console.log('Circle clicked:', index, visualizationData.predictions[index])
            handlePredictionClick(visualizationData.predictions[index])
          })
        }
      })

      // Add zoom and pan functionality
      const svg = d3.select(plot.querySelector('svg'))

      if (svg.node()) {
        console.log('SVG found for zoom setup')

        // Find all g elements that contain the plot content
        const allGroups = svg.selectAll('g')
        console.log('Found g elements:', allGroups.size())

        const zoom = d3.zoom()
          .scaleExtent([0.5, 5]) // Allow zooming from 50% to 500%
          .on('zoom', (event) => {
            console.log('Zoom event:', event.transform)
            // Apply transform to all content groups
            allGroups.attr('transform', event.transform)
          })

        // Apply zoom behavior to the SVG
        svg.call(zoom)

        // Add double-click to reset zoom
        svg.on('dblclick.zoom', () => {
          console.log('Double-click zoom reset')
          svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity)
        })

        // Prevent click events from interfering with zoom
        svg.on('click.zoom', null)
      }

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
              <p>• Hover over nodes to see prediction details in tooltips</p>
              <p>• Click on nodes to view full prediction details in a modal</p>
              <p>• Use mouse wheel or pinch to zoom in/out for better exploration</p>
              <p>• Drag to pan around the galaxy when zoomed in</p>
              <p>• Double-click anywhere to reset zoom to default view</p>
              <p>• Larger nodes indicate higher confidence predictions</p>
              <p>• Colors represent different topics/subjects</p>
              <p>• Nodes are clustered by topic similarity using smart algorithms</p>
              <p>• {predictions.length} predictions from social media platforms</p>
            </div>
          </div>
        </div>

        {/* Post Detail Modal */}
        <PostModal
          prediction={selectedPrediction}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </div>
  )
}

export default Galaxy