const express = require('express');
const router = express.Router();

// Portfolio home page
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Portfolio - Stafford.dev</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .nav { margin-bottom: 30px; }
        .nav a { margin: 0 15px; text-decoration: none; color: #007bff; font-weight: 500; }
        .nav a:hover { text-decoration: underline; }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <nav class="nav">
          <a href="/">Home</a>
          <a href="/portfolio">Portfolio</a>
          <a href="/admin">Admin</a>
        </nav>
        <h1>🎨 Portfolio</h1>
        <p>Welcome to the portfolio section. This will showcase projects, skills, and experience.</p>
        <p><em>Coming soon...</em></p>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;