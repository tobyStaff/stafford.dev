const express = require('express');
const router = express.Router();

// Authentication middleware for admin routes
router.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
});

// Admin dashboard
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Dashboard - Stafford.dev</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .nav { margin-bottom: 30px; }
        .nav a { margin: 0 15px; text-decoration: none; color: #007bff; font-weight: 500; }
        .nav a:hover { text-decoration: underline; }
        .user-info { background: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; }
        .logout-btn { background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <nav class="nav">
          <a href="/">Home</a>
          <a href="/portfolio">Portfolio</a>
          <a href="/admin">Admin</a>
        </nav>
        <div class="user-info">
          <img src="${req.user.profile_photo_url || 'https://via.placeholder.com/60'}" alt="Profile" style="border-radius: 50%; width: 60px; height: 60px; vertical-align: middle; margin-right: 15px;">
          <strong>${req.user.display_name || req.user.username || req.user.email}</strong>
          <br><small>${req.user.email}</small>
        </div>
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage your applications, content, and settings from here.</p>
        <p><em>Management tools coming soon...</em></p>
        <a href="/logout" class="logout-btn">Logout</a>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;