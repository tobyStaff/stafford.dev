const Tools = () => {
  return (
    <div className="bg-primary-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Tools
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Useful tools and utilities for development and productivity
            </p>
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Available Tools</h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="card text-left">
              <h3 className="font-semibold text-lg mb-2 text-white">Fast JIRA Report</h3>
              <p className="text-gray-300 mb-4">A fast and efficient tool for generating JIRA reports and analytics.</p>
              <a 
                href="http://fast-jira-report.local" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Open Fast JIRA Report
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <div className="text-2xl">🔧</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">More Tools Coming Soon</h3>
            <p className="text-gray-300">
              Additional development tools and utilities will be added here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tools