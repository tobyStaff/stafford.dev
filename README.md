# stafford.dev - Portfolio Website

A full-stack portfolio website with secure Express.js backend, React frontend, and interactive data visualizations.

## Security Features

### 🔒 Core Security
- **Helmet.js**: Security headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting**: IP-based request throttling
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Request sanitization and validation
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with high salt rounds

### 🛡️ Request Protection
- **Body Size Limits**: Prevents oversized payloads
- **Input Sanitization**: XSS protection via express-validator
- **Request Logging**: Morgan for audit trails
- **Error Handling**: Secure error responses

### 🔐 Authentication Security
- **Strong Password Policy**: Min 8 chars, mixed case, numbers, symbols
- **Auth Rate Limiting**: Stricter limits on login endpoints
- **JWT Expiration**: 1-hour token lifetime
- **Secure Token Storage**: Authorization header format

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup PostgreSQL database**:
   ```bash
   # Install PostgreSQL (Ubuntu/Debian)
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # Or using Docker
   docker run --name postgres-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
   
   # Create database
   sudo -u postgres createdb secure_web_server
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and security values
   ```

4. **Initialize database**:
   ```bash
   npm run init-db
   ```

5. **Start server**:
   ```bash
   npm start
   ```

## Features

### 🌌 Galaxy Visualization
- **Interactive Predictions Map**: Observable Plot visualization of social media predictions
- **Topic Clustering**: Smart clustering algorithms group predictions by similarity
- **Real-time Statistics**: Live data analytics and engagement metrics
- **Advanced Filtering**: Filter by topic, platform, confidence, date range, and search
- **Data Processing Pipeline**: Comprehensive data normalization and preparation utilities

### 📊 Data Architecture
- **Prediction Model**: Complete database model for social media prediction posts
- **Topic Classification**: 6 main categories (Technology, Politics, Economics, Sports, Entertainment, Science)
- **Engagement Metrics**: Tracks likes, shares, comments with normalization
- **Confidence Scoring**: 0-1 scale prediction confidence with statistical analysis

## API Endpoints

### Public
- `GET /` - Health check
- `GET /health` - Server status

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Protected
- `GET /api/protected` - Requires JWT token
- `POST /api/data` - Submit validated data

### Galaxy Visualization
- `GET /api/galaxy/predictions` - Fetch predictions with filtering options
- `GET /api/galaxy/predictions/:id` - Get single prediction details
- `GET /api/galaxy/topics` - Get topic statistics and color mappings
- `GET /api/galaxy/statistics` - Get comprehensive galaxy statistics
- `POST /api/galaxy/predictions` - Create new prediction entries

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` |
| `JWT_SECRET` | JWT signing key | `your-secret-key` |
| `SESSION_SECRET` | Session signing key | `your-session-secret` |
| `ALLOWED_ORIGINS` | CORS origins | `https://yourdomain.com` |
| `DATABASE_HOST` | Database host | `localhost` |
| `DATABASE_PORT` | Database port | `5432` |
| `DATABASE_NAME` | Database name | `secure_web_server` |
| `DATABASE_USER` | Database user | `postgres` |
| `DATABASE_PASSWORD` | Database password | `your-db-password` |
| `DATABASE_URL` | Full database URL | `postgresql://user:pass@host:5432/db` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `your-client-secret` |

## Security Checklist

- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ Input validation active
- ✅ Authentication secured
- ✅ Error handling safe
- ✅ CORS configured
- ✅ Database integration with security features
- ✅ Account lockout protection
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ Connection pooling and retry logic
- ⚠️  HTTPS setup required
- ⚠️  Monitoring/logging needed

## Production Deployment

1. **Database Setup**: 
   - Create production PostgreSQL database
   - Set strong database credentials
   - Configure connection pooling
   - Enable SSL for database connections

2. **Security Configuration**:
   - Set strong JWT and session secrets
   - Configure CORS for your domain
   - Enable HTTPS with SSL certificates
   - Set NODE_ENV=production

3. **Database Migration**:
   ```bash
   npm run init-db
   ```

4. **Monitoring & Maintenance**:
   - Setup logging and error tracking
   - Monitor database performance
   - Regular security updates
   - Backup strategy implementation

## Database Features

### User Management
- ✅ Secure user registration and login
- ✅ Google OAuth integration with user linking
- ✅ Account lockout after failed attempts (5 attempts = 15min lockout)
- ✅ Password strength validation
- ✅ Email uniqueness enforcement
- ✅ Soft delete support (paranoid mode)

### Prediction Data Management
- ✅ Comprehensive prediction model with validation
- ✅ Topic-based categorization and clustering
- ✅ Engagement metrics tracking (likes, shares, comments)
- ✅ Confidence and sentiment analysis storage
- ✅ Platform and author information management
- ✅ Coordinate positioning for visualization
- ✅ Source URL tracking and verification status
- ✅ Performance-optimized indexes for queries

### Security Features
- ✅ bcrypt password hashing (12 rounds)
- ✅ SQL injection prevention via Sequelize ORM
- ✅ Connection pooling (2-10 connections)
- ✅ Database connection retry logic
- ✅ Prepared statements and parameterized queries
- ✅ Input sanitization and validation

## Galaxy Visualization Technical Details

### Data Processing Pipeline
- **Topic Clustering**: D3 force simulation with collision detection
- **Position Calculation**: Smart clustering keeps related predictions grouped
- **Data Normalization**: Engagement metrics normalized to 0-1 scale
- **Statistical Analysis**: Real-time calculation of topic and platform statistics

### Filtering Capabilities
- **Topic Filter**: Filter by Technology, Politics, Economics, Sports, Entertainment, Science
- **Platform Filter**: Filter by social media platform (Twitter, Reddit, LinkedIn, etc.)
- **Confidence Range**: Filter by prediction confidence levels (0-1 scale)
- **Date Range**: Filter predictions by creation date
- **Text Search**: Search within prediction content and author names

### Visualization Features
- **Color Coding**: Each topic has a distinct color for easy identification
- **Node Sizing**: Larger nodes indicate higher confidence predictions
- **Clustering**: Related predictions are grouped together spatially
- **Interactive Tooltips**: Hover for detailed prediction information
- **Performance Optimized**: Handles 1000+ predictions smoothly

## Testing

### Security Features
```bash
# Register user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"SecurePass123!"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePassword123!"}'

# Access protected route
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Galaxy API Testing
```bash
# Get all predictions
curl -X GET http://localhost:3000/api/galaxy/predictions

# Get predictions filtered by topic
curl -X GET "http://localhost:3000/api/galaxy/predictions?topic=Technology&limit=50"

# Get topic statistics
curl -X GET http://localhost:3000/api/galaxy/topics

# Get overall statistics
curl -X GET http://localhost:3000/api/galaxy/statistics

# Get single prediction
curl -X GET http://localhost:3000/api/galaxy/predictions/PREDICTION_ID
```

## Configuring Google
 1. Go to the https://console.cloud.google.com/
  2. Select your project
  3. Navigate to APIs & Services → Credentials
  4. Click on your OAuth 2.0 Client ID
  5. In the Authorized redirect URIs section, add: http[s]://[domain]/auth/google/callback
  6. Save the changes