import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon, FolderIcon, BriefcaseIcon, DocumentTextIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

const Login = () => {
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        })
        if (response.ok) {
          // User is already authenticated, redirect to dashboard
          window.location.href = '/dashboard'
        }
      } catch (error) {
        // User not authenticated, stay on login page
      }
    }
    
    checkAuth()
  }, [])

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google'
  }

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Portfolio', href: '/portfolio', icon: FolderIcon },
    { name: 'Professional', href: '/professional', icon: BriefcaseIcon },
    { name: 'Blog', href: '/blog', icon: DocumentTextIcon, disabled: true },
    { name: 'Tools', href: '/tools', icon: WrenchScrewdriverIcon, disabled: true },
  ]

  return (
    <div className="min-h-screen bg-primary-900 text-gray-100 flex">
      {/* Sidebar matching main site design */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-primary-800">
        <div className="flex items-center justify-between h-16 px-6 border-b border-primary-700">
          <div className="text-xl font-bold text-white">
            Stafford.dev
          </div>
        </div>

        <nav className="mt-8 px-4 flex-1">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <div className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.disabled
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-gray-400 cursor-not-allowed opacity-60'
                  }`}>
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {item.disabled && <span className="ml-auto text-xs opacity-75">(Soon)</span>}
                  </div>
                </li>
              )
            })}
          </ul>
          
          {/* Login prompt in sidebar */}
          <div className="mt-8 p-4 bg-primary-700 rounded-lg border border-primary-600">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white mb-2">Access Required</p>
              <p className="text-xs text-gray-300">Sign in to explore my portfolio, professional experience, and upcoming projects.</p>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-primary-700">
          <div className="text-center text-xs text-gray-400">
            <p>&copy; 2024 Stafford.dev</p>
          </div>
        </div>
      </div>

      {/* Main login content */}
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Mobile header */}
        <div className="lg:hidden mb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Stafford.dev
            </h1>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-3 text-lg text-gray-300">
              Sign in to access the full experience
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Explore my portfolio, professional background, and development projects with personalized access to admin tools and exclusive content.
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card">
            <div className="space-y-6">
              <div>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Secure authentication powered by Google OAuth
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login