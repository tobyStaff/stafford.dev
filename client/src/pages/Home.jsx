import { Link } from 'react-router-dom'
import { 
  PaintBrushIcon, 
  DocumentTextIcon, 
  WrenchScrewdriverIcon 
} from '@heroicons/react/24/outline'

const Home = () => {
  const apps = [
    {
      name: 'Portfolio',
      description: 'Showcase of projects, skills, and experience',
      icon: PaintBrushIcon,
      href: '/portfolio',
      available: true,
    },
    {
      name: 'Blog',
      description: 'Technical articles and thoughts',
      icon: DocumentTextIcon,
      href: '/blog',
      available: false,
    },
    {
      name: 'Tools',
      description: 'Useful utilities and tools',
      icon: WrenchScrewdriverIcon,
      href: '/tools',
      available: false,
    },
  ]

  return (
    <div className="bg-primary-900">
      {/* Hero Section */}
      <div className="relative bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="text-purple-400">Stafford.dev</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A modern application hub showcasing projects, tools, and technical expertise. 
            Built with React, Express.js, and modern web technologies.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <svg
            className="w-full h-6 text-primary-900"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M1200 120L0 16.48V120z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Applications
          </h2>
          <p className="text-lg text-gray-300">
            Explore the different applications and tools available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => {
            const IconComponent = app.icon
            
            return app.available ? (
              <Link
                key={app.name}
                to={app.href}
                className="bg-primary-800 border border-primary-700 rounded-lg p-6 hover:bg-primary-700 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4 group-hover:bg-purple-500 transition-colors">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {app.name}
                  </h3>
                  <p className="text-gray-300">
                    {app.description}
                  </p>
                </div>
              </Link>
            ) : (
              <div
                key={app.name}
                className="bg-primary-800 border border-primary-700 rounded-lg p-6 opacity-60 cursor-not-allowed"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-600 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {app.name}
                  </h3>
                  <p className="text-gray-300 mb-2">
                    {app.description}
                  </p>
                  <span className="text-sm text-gray-400 italic">
                    Coming Soon
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-primary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Built with Modern Technologies
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl">⚛️</div>
              <h3 className="font-semibold text-white">React</h3>
              <p className="text-sm text-gray-300">Modern UI framework</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🎨</div>
              <h3 className="font-semibold text-white">Tailwind CSS</h3>
              <p className="text-sm text-gray-300">Utility-first styling</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🚀</div>
              <h3 className="font-semibold text-white">Express.js</h3>
              <p className="text-sm text-gray-300">Fast backend API</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🔐</div>
              <h3 className="font-semibold text-white">Secure Auth</h3>
              <p className="text-sm text-gray-300">Google OAuth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home