const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// Database imports
const { testConnection } = require('./config/database');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for reverse proxy/load balancer
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      scriptSrc: ["'self'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://accounts.google.com"],
      frameSrc: ["https://accounts.google.com"]
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
});

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Request logging
app.use(morgan('combined'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  cookie: { 
    secure: false, // Set to false for debugging
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    domain: undefined // Let it default to current domain
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve React build in production, client/public in development
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
} else {
  app.use(express.static(path.join(__dirname, 'client/public')));
}

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://stafford.dev/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const googleId = profile.id;
    
    // Check if user already exists
    let user = await User.findByGoogleId(googleId);
    
    if (!user) {
      // Check if user exists with same email but different auth method
      const existingUser = await User.findByEmail(email);
      
      if (existingUser) {
        // Link Google account to existing user
        existingUser.google_id = googleId;
        existingUser.display_name = existingUser.display_name || profile.displayName;
        existingUser.profile_photo_url = profile.photos[0]?.value;
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user from Google profile
        user = await User.create({
          email: email,
          google_id: googleId,
          display_name: profile.displayName,
          profile_photo_url: profile.photos[0]?.value,
          auth_provider: 'google',
          email_verified: true, // Google emails are verified
        });
      }
    }
    
    // Update last login
    await user.updateLastLogin();
    
    return done(null, user.toSafeJSON());
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Authentication middleware - require login for all routes except login/auth
const requireAuth = (req, res, next) => {
  // Allow access to auth routes, health check, and API endpoints for authentication
  if (req.path.startsWith('/auth/') || 
      req.path === '/login' || 
      req.path === '/health' ||
      req.path === '/api/login' ||
      req.path === '/api/register' ||
      req.path === '/api/user') {
    return next();
  }

  // Check if user is authenticated via session (Google OAuth)
  if (req.isAuthenticated()) {
    return next();
  }

  // Check if user is authenticated via JWT token
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      req.user = decoded;
      return next();
    } catch (error) {
      // Token invalid, continue to redirect
    }
  }

  // Not authenticated - redirect to login
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // For non-API routes, redirect to login
  res.redirect('/login');
};

// Admin access restriction middleware - only allow toby.stafford@gmail.com
const requireAdmin = (req, res, next) => {
  if (!req.isAuthenticated() && !req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const userEmail = req.user?.email || req.user?.user?.email;
  
  if (userEmail !== 'toby.stafford@gmail.com') {
    if (req.path.startsWith('/api/')) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    // Redirect non-admin users away from admin sections
    return res.redirect('/');
  }

  next();
};

// Input validation helpers
const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Apply site-wide authentication middleware
app.use(requireAuth);

// Route imports (only auth routes needed, React handles UI routing)
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API endpoint to get current user info
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Mount auth routes (React handles UI routing)
app.use('/', authRoutes);

// Mount admin routes with admin restriction
app.use('/admin', requireAdmin, adminRoutes);

// Auth routes with validation
app.post('/api/register', 
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    body('username').isLength({ min: 3, max: 30 }).isAlphanumeric()
  ],
  validateInput,
  async (req, res) => {
    try {
      const { email, password, username } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      
      // Check if username is taken (if provided)
      if (username) {
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
          return res.status(400).json({ error: 'Username is already taken' });
        }
      }
      
      // Create new user in database
      const user = await User.create({
        email,
        username,
        password_hash: password, // Will be hashed by the model hook
        auth_provider: 'local'
      });
      
      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );
      
      res.status(201).json({ 
        message: 'User registered successfully',
        token,
        user: user.toSafeJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific database errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors[0].path;
        return res.status(400).json({ 
          error: `${field === 'email' ? 'Email' : 'Username'} is already taken` 
        });
      }
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: error.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }
      
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

app.post('/api/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
  ],
  validateInput,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user in database
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check if account is locked
      if (user.isLocked()) {
        return res.status(423).json({ 
          error: 'Account is temporarily locked due to too many failed attempts. Please try again later.' 
        });
      }
      
      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({ error: 'Account is disabled' });
      }
      
      // Validate password
      const isValidPassword = await user.validatePassword(password);
      
      if (!isValidPassword) {
        // Increment failed attempts
        await user.incrementFailedAttempts();
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Reset failed attempts on successful login
      await user.resetFailedAttempts();
      
      // Update last login
      await user.updateLastLogin();
      
      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );
      
      res.json({ 
        message: 'Login successful',
        token,
        user: user.toSafeJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Protected route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ 
    message: 'Access granted to protected resource',
    user: req.user
  });
});

// API routes with validation
app.post('/api/data',
  [
    body('title').isString().trim().escape().isLength({ min: 1, max: 100 }),
    body('content').isString().trim().escape().isLength({ max: 1000 })
  ],
  validateInput,
  (req, res) => {
    const { title, content } = req.body;
    res.json({ 
      message: 'Data received successfully',
      data: { title, content }
    });
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all handler for React Router in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
} else {
  // In development, serve the client's index.html for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database. Server not started.');
      process.exit(1);
    }
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Secure server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Database connection established`);
      console.log(`🌐 Public access: http://104.248.225.107:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;