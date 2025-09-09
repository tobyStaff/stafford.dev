const express = require('express');
const router = express.Router();

// Main hub/home route
router.get('/', (req, res) => {
  console.log('Home route - Authenticated:', req.isAuthenticated());
  console.log('Home route - User:', !!req.user);
  console.log('Home route - Session ID:', req.sessionID);
  
  const userInfo = req.isAuthenticated() ? `
    <div class="user-info">
      <img src="${req.user.profile_photo_url || 'https://via.placeholder.com/60'}" alt="Profile">
      <span>Welcome, ${req.user.display_name || req.user.username || req.user.email}!</span>
      <a href="/admin" class="admin-link">Admin</a>
      <a href="/logout" class="logout-btn">Logout</a>
    </div>
  ` : `
    <div class="auth-info">
      <a href="/login" class="login-btn">Login</a>
    </div>
  `;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Stafford.dev - Application Hub</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
        .header { background: #343a40; color: white; padding: 20px 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .user-info { text-align: right; margin-bottom: 10px; }
        .user-info img { border-radius: 50%; width: 40px; height: 40px; vertical-align: middle; margin-right: 10px; }
        .user-info span { vertical-align: middle; margin-right: 15px; }
        .admin-link, .login-btn, .logout-btn { background: #007bff; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 14px; }
        .logout-btn { background: #dc3545; margin-left: 10px; }
        .auth-info { text-align: right; }
        h1 { margin: 0; font-size: 2.5em; }
        .subtitle { color: #6c757d; margin-top: 10px; }
        .main { padding: 60px 0; text-align: center; }
        .apps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 800px; margin: 0 auto; }
        .app-card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-decoration: none; color: inherit; transition: transform 0.2s; }
        .app-card:hover { transform: translateY(-5px); text-decoration: none; color: inherit; }
        .app-icon { font-size: 3em; margin-bottom: 15px; }
        .app-title { font-size: 1.5em; font-weight: bold; margin-bottom: 10px; color: #333; }
        .app-desc { color: #666; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="container">
          ${userInfo}
          <h1>Stafford.dev</h1>
          <div class="subtitle">Application Hub & Portfolio</div>
        </div>
      </div>
      <div class="main">
        <div class="container">
          <div class="apps-grid">
            <a href="/portfolio" class="app-card">
              <div class="app-icon">🎨</div>
              <div class="app-title">Portfolio</div>
              <div class="app-desc">Showcase of projects, skills, and experience</div>
            </a>
            <div class="app-card" style="opacity: 0.6;">
              <div class="app-icon">📝</div>
              <div class="app-title">Blog</div>
              <div class="app-desc">Technical articles and thoughts (Coming Soon)</div>
            </div>
            <div class="app-card" style="opacity: 0.6;">
              <div class="app-icon">🔧</div>
              <div class="app-title">Tools</div>
              <div class="app-desc">Useful utilities and tools (Coming Soon)</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;