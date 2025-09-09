const express = require('express');
const passport = require('passport');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login - Stafford.dev</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .login-container { max-width: 400px; margin: 0 auto; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .google-btn { background: #4285f4; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; font-size: 16px; }
        .google-btn:hover { background: #357ae8; }
        .home-link { display: block; margin-top: 20px; color: #007bff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h1>Welcome to Stafford.dev</h1>
        <p>Please sign in with your Google account</p>
        <a href="/auth/google" class="google-btn">Sign in with Google</a>
        <a href="/" class="home-link">← Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

// Dashboard (success page)
router.get('/dashboard', (req, res) => {
  console.log('Dashboard route - Authenticated:', req.isAuthenticated());
  console.log('Dashboard route - User:', !!req.user);
  console.log('Dashboard route - Session ID:', req.sessionID);
  
  if (req.isAuthenticated()) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Dashboard - Stafford.dev</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .profile { max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
          .profile img { border-radius: 50%; width: 100px; height: 100px; }
          .btn { padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; }
          .admin-btn { background: #007bff; color: white; }
          .logout-btn { background: #dc3545; color: white; }
          .home-btn { background: #28a745; color: white; }
        </style>
      </head>
      <body>
        <div class="profile">
          <h1>🎉 LOGIN SUCCESS!</h1>
          <img src="${req.user.profile_photo_url || 'https://via.placeholder.com/100'}" alt="Profile">
          <h2>Hello ${req.user.display_name || req.user.username || req.user.email}!</h2>
          <p>Email: ${req.user.email}</p>
          <div>
            <a href="/" class="btn home-btn">Home</a>
            <a href="/admin" class="btn admin-btn">Admin</a>
            <a href="/logout" class="btn logout-btn">Logout</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.send('<h1>❌ Not authenticated - redirecting to login</h1><script>window.location="/login"</script>');
  }
});

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  (req, res, next) => {
    console.log('=== CALLBACK ENDPOINT HIT ===');
    console.log('Query params:', req.query);
    console.log('Headers:', req.headers);
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureFlash: false
  }),
  (req, res) => {
    console.log('OAuth callback - User authenticated:', !!req.user);
    console.log('OAuth callback - Session ID:', req.sessionID);
    console.log('OAuth callback - Full user:', req.user);
    
    // Explicitly save the session before redirecting
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.redirect('/login');
      }
      console.log('Session saved successfully, redirecting to dashboard');
      res.redirect('/dashboard');
    });
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect('/login');
  });
});

module.exports = router;