const Portfolio = () => {
  return (
    <div className="bg-primary-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Portfolio
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              A showcase of projects, technical skills, and professional experience
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-600 rounded-full mb-6">
            <div className="text-4xl">🎨</div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Portfolio Coming Soon
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            This section will showcase projects, technical skills, work experience, 
            and achievements. Stay tuned for updates!
          </p>
          
          {/* Featured Projects */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Featured Projects</h3>
            <div className="max-w-2xl mx-auto">
              <div className="card text-left">
                <h4 className="font-semibold text-lg mb-2 text-white">Yawn Tennis</h4>
                <p className="text-gray-300 mb-4">A tennis-focused web application providing tools and resources for tennis enthusiasts.</p>
                <a 
                  href="https://yawntennis.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  Visit Yawn Tennis
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Planned Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="card text-left">
              <h3 className="font-semibold text-lg mb-2 text-white">Projects Showcase</h3>
              <p className="text-gray-300">Featured projects with live demos, source code, and technical details</p>
            </div>
            <div className="card text-left">
              <h3 className="font-semibold text-lg mb-2 text-white">Skills & Technologies</h3>
              <p className="text-gray-300">Technical expertise across different programming languages and frameworks</p>
            </div>
            <div className="card text-left">
              <h3 className="font-semibold text-lg mb-2 text-white">Experience Timeline</h3>
              <p className="text-gray-300">Professional journey, education, and key achievements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio