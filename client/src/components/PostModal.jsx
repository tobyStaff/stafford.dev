import { useState, useEffect } from 'react'
import { XMarkIcon, CalendarIcon, UserIcon, ChatBubbleLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline'
import { TOPIC_COLORS } from '../utils/galaxyData'

const PostModal = ({ prediction, isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      document.body.style.overflow = 'auto'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !prediction) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'Very High'
    if (confidence >= 0.6) return 'High'
    if (confidence >= 0.4) return 'Medium'
    if (confidence >= 0.2) return 'Low'
    return 'Very Low'
  }

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.3) return 'Positive'
    if (sentiment < -0.3) return 'Negative'
    return 'Neutral'
  }

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.3) return 'text-green-400'
    if (sentiment < -0.3) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'bg-opacity-75' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full border border-white/50"
              style={{ backgroundColor: TOPIC_COLORS[prediction.topic] || '#6B7280' }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">Prediction Details</h2>
              <p className="text-purple-300 text-sm">{prediction.topic}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Prediction Content */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-3">Prediction</h3>
            <p className="text-gray-200 leading-relaxed text-lg">
              {prediction.content}
            </p>
          </div>

          {/* Author Information */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Author Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Author</p>
                <p className="text-white font-medium">{prediction.author?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Platform</p>
                <p className="text-purple-300 font-medium">{prediction.author?.platform || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Handle</p>
                <p className="text-gray-300">{prediction.author?.handle || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Posted</p>
                <p className="text-gray-300 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {formatDate(prediction.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics & Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prediction Metrics */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-4">Prediction Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Confidence Level</span>
                    <span className="text-white font-medium">
                      {getConfidenceLabel(prediction.confidence)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(prediction.confidence * 100)}% confidence
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Sentiment</span>
                    <span className={`font-medium ${getSentimentColor(prediction.sentiment)}`}>
                      {getSentimentLabel(prediction.sentiment)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-purple-500/10">
              <h3 className="text-lg font-semibold text-white mb-4">Engagement</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <HeartIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="text-white font-medium">
                    {(prediction.engagement?.likes || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <ShareIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">Shares</span>
                  </div>
                  <span className="text-white font-medium">
                    {(prediction.engagement?.shares || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400">
                    <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">Comments</span>
                  </div>
                  <span className="text-white font-medium">
                    {(prediction.engagement?.comments || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Galaxy Position */}
          <div className="bg-gray-800/20 rounded-xl p-4 border border-purple-500/10">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Galaxy Coordinates</h3>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>X: {Math.round(prediction.coordinates?.x || 0)}</span>
              <span>Y: {Math.round(prediction.coordinates?.y || 0)}</span>
              <span>Topic: {prediction.topic}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-purple-500/20 p-6">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
            {prediction.sourceUrl && (
              <a
                href={prediction.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                View Original
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostModal