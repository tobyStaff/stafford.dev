import { useState, useEffect } from 'react'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/user', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        
        // Check admin access if required
        if (requireAdmin && userData.email !== 'toby.stafford@gmail.com') {
          setError('Admin access required')
          return
        }
      } else {
        // Not authenticated, redirect to login
        window.location.href = '/login'
        return
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/login'
      return
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (!user) {
    // This shouldn't happen due to the redirect above, but just in case
    window.location.href = '/login'
    return null
  }

  return children
}

export default ProtectedRoute