# Secure Web Server

A production-ready Express.js server with comprehensive security features.

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

### Security Features
- ✅ bcrypt password hashing (12 rounds)
- ✅ SQL injection prevention via Sequelize ORM
- ✅ Connection pooling (2-10 connections)
- ✅ Database connection retry logic
- ✅ Prepared statements and parameterized queries
- ✅ Input sanitization and validation

## Testing

Test the security features:

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