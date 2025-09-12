import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, FolderIcon, BriefcaseIcon, DocumentTextIcon, WrenchScrewdriverIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const Layout = ({ children }) => {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Check if user is authenticated
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
      }
    } catch (error) {
      console.log('User not authenticated')
    }
  }

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Portfolio', href: '/portfolio', icon: FolderIcon },
    { name: 'Professional', href: '/professional', icon: BriefcaseIcon },
    { name: 'Blog', href: '/blog', icon: DocumentTextIcon, disabled: true },
    { name: 'Tools', href: '/tools', icon: WrenchScrewdriverIcon },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="min-h-screen bg-primary-900 text-gray-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-primary-700">
          <Link to="/" className="text-xl font-bold text-white">
            Stafford.dev
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      item.disabled
                        ? 'text-gray-500 cursor-not-allowed'
                        : isActive(item.href)
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-primary-700 hover:text-white'
                    }`}
                    onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {item.disabled && <span className="ml-auto text-xs opacity-75">(Soon)</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-4">
                <img
                  src={user.profile_photo_url || 'https://via.placeholder.com/32'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.display_name || user.email}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {user.email === 'toby.stafford@gmail.com' && (
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-primary-700 hover:text-white rounded-lg transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <a
                  href="/logout"
                  className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-primary-700 hover:text-red-300 rounded-lg transition-colors"
                >
                  Logout
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-xs text-gray-400">Loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-primary-800 border-b border-primary-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <Link to="/" className="text-lg font-bold text-white">
            Stafford.dev
          </Link>
          <div className="w-6"></div>
        </div>

        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-primary-800 border-t border-primary-700 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400">&copy; 2024 Stafford.dev. Built with React, Tailwind CSS, and Express.js</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout