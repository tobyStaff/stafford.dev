import { useState, useEffect } from 'react'

const Admin = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      window.location.href = '/login'
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

  return (
    <div className="min-h-screen bg-primary-900">
      {/* Header */}
      <div className="bg-primary-800 shadow-sm border-b border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            {user && (
              <div className="flex items-center space-x-4">
                <img
                  src={user.profile_photo_url || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.display_name || user.email}
                  </p>
                  <p className="text-xs text-gray-300">Administrator</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Stats */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">1</div>
                  <p className="text-sm text-gray-300 mt-1">Applications</p>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">0</div>
                  <p className="text-sm text-gray-300 mt-1">Projects</p>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">0</div>
                  <p className="text-sm text-gray-300 mt-1">Blog Posts</p>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">1</div>
                  <p className="text-sm text-gray-300 mt-1">Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Management Sections */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              Portfolio Management
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg hover:bg-primary-600 transition-colors">
                <div className="font-medium text-white">Projects</div>
                <div className="text-sm text-gray-300">Manage project showcase</div>
              </button>
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg hover:bg-primary-600 transition-colors">
                <div className="font-medium text-white">Skills</div>
                <div className="text-sm text-gray-300">Update technical skills</div>
              </button>
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg hover:bg-primary-600 transition-colors">
                <div className="font-medium text-white">Experience</div>
                <div className="text-sm text-gray-300">Edit work history</div>
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              Content Management
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg opacity-60 cursor-not-allowed">
                <div className="font-medium text-white">Blog Posts</div>
                <div className="text-sm text-gray-300">Coming soon</div>
              </button>
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg opacity-60 cursor-not-allowed">
                <div className="font-medium text-white">Media Library</div>
                <div className="text-sm text-gray-300">Coming soon</div>
              </button>
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg opacity-60 cursor-not-allowed">
                <div className="font-medium text-white">Pages</div>
                <div className="text-sm text-gray-300">Coming soon</div>
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              System Settings
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg opacity-60 cursor-not-allowed">
                <div className="font-medium text-white">Site Configuration</div>
                <div className="text-sm text-gray-300">Coming soon</div>
              </button>
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg opacity-60 cursor-not-allowed">
                <div className="font-medium text-white">User Management</div>
                <div className="text-sm text-gray-300">Coming soon</div>
              </button>
              <button className="w-full text-left p-3 bg-primary-700 rounded-lg opacity-60 cursor-not-allowed">
                <div className="font-medium text-white">Analytics</div>
                <div className="text-sm text-gray-300">Coming soon</div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <p className="text-gray-300">No recent activity to display</p>
              <p className="text-sm text-gray-400 mt-2">
                Activity tracking will be available soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin