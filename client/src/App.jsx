import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Professional from './pages/Professional'
import Tools from './pages/Tools'
import Admin from './pages/Admin'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route - not protected */}
        <Route path="/login" element={<Login />} />
        
        {/* All other routes require authentication */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/professional" element={<Professional />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
