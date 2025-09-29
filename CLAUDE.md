# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack portfolio website with a secure Express.js backend and React frontend (stafford.dev). The application emphasizes security features including JWT authentication, rate limiting, PostgreSQL database integration, and comprehensive input validation.

## Common Commands

### Development
- `npm run dev` - Start development server (uses scripts/dev-server.sh, but scripts directory missing)
- `npm run server` - Start production server directly with node
- `npm start` - Start production server using PM2 (uses scripts/start-server.sh, but scripts directory missing)
- `npm stop` - Stop production server (uses scripts/stop-server.sh, but scripts directory missing)
- `npm restart` - Restart production server (uses scripts/restart-server.sh, but scripts directory missing)

### Client (React + Vite)
- `cd client && npm run dev` - Start React development server on port 3001
- `npm run build` - Build React client for production (builds to client/dist/)
- `cd client && npm run lint` - Run ESLint on client code
- `cd client && npm run preview` - Preview production build

### Database
- `npm run init-db` - Initialize PostgreSQL database with tables
- `npm run init-db-force` - Force reinitialize database (drops existing)

### Deployment
- `npm run deploy` - Full deployment script (uses scripts/deploy.sh, but scripts directory missing)
- `npm run quick-deploy` - Quick deployment without full rebuild (uses scripts/quick-deploy.sh, but scripts directory missing)
- `npm run status` - Check server status (uses scripts/status.sh, but scripts directory missing)
- `npm run logs` - View server logs (tail -f server.log)

## Architecture

### Backend Structure
- **server.js** - Main Express server with security middleware, authentication, and route setup
- **routes/** - API route handlers
  - `auth.js` - Authentication endpoints (login, register, Google OAuth)
  - `home.js` - Portfolio content and protected routes
  - `admin.js` - Admin-only endpoints
  - `portfolio.js` - Portfolio data endpoints
  - `galaxy.js` - Galaxy/prediction visualization endpoints
- **models/** - Sequelize ORM models
  - `User.js` - User model with password hashing and account lockout
  - `Prediction.js` - Prediction model for galaxy feature
- **config/** - Configuration files
  - `database.js` - PostgreSQL connection and Sequelize setup
- **scripts/** - Deployment and maintenance scripts (directory exists but may be incomplete)

### Frontend Structure (client/)
- **React 19** with **Vite** build system
- **Tailwind CSS** for styling with forms and typography plugins
- **React Router** for client-side routing
- **Axios** for API communication
- **src/components/** - Reusable React components
- **src/pages/** - Page-level components
- **D3.js and Observable Plot** for data visualizations

### Security Features
- **Helmet.js** - Security headers including CSP, HSTS
- **Rate limiting** - IP-based request throttling (100 requests/15 minutes)
- **JWT authentication** - 1-hour token expiration
- **bcrypt** password hashing (12 salt rounds)
- **Account lockout** - 5 failed attempts = 15-minute lockout
- **Input validation** - express-validator for all endpoints
- **CORS** configuration for cross-origin requests

### Database
- **PostgreSQL** with Sequelize ORM
- Connection pooling (2-10 connections)
- Retry logic for connection failures
- Paranoid mode (soft deletes) enabled
- Prepared statements prevent SQL injection

## Environment Setup

Required environment variables in `.env`:
- Database: `DATABASE_URL` or individual DB connection vars
- Authentication: `JWT_SECRET`, `SESSION_SECRET`
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- CORS: `ALLOWED_ORIGINS`
- Server: `PORT` (defaults to 3000), `NODE_ENV`

## Development Setup

### Server Configuration
- Default port: 3000 (configurable via PORT environment variable)
- The Express server serves both API endpoints and built React client
- In development, run the server with `npm run server` or `node server.js`

### Client Configuration
- React dev server runs on port 3001 (configured in client/vite.config.js)
- Vite proxies API calls to the Express server on port 3000
- Build output goes to `client/dist/`
- The Express server serves built client files from `client/dist/` in production

### Running the Application

**Development Mode:**
1. Start the Express server: `npm run server` (runs on port 3000)
2. Start the React dev server: `cd client && npm run dev` (runs on port 3001)
3. Access the development client at http://localhost:3001
4. API calls are automatically proxied to the Express server

**Production Mode:**
1. Build the React client: `npm run build` (or `cd client && npm run build`)
2. Start the Express server: `npm run server`
3. Access the application at http://localhost:3000 (or configured PORT)
4. The Express server serves the built React client

## Testing

The project includes integration testing (`test-integration.js`) for API endpoints. Test authentication by:
1. Register user via `POST /api/register`
2. Login via `POST /api/login` to get JWT
3. Access protected routes with `Authorization: Bearer <token>` header

## Important Notes

- The `scripts/` directory is referenced in package.json but may be missing or incomplete
- The application includes a "galaxy" feature for prediction visualization with D3.js
- Client and server run on different ports in development (3001 and 3000 respectively)
- In production, the Express server serves the built React client
- The project uses React 19 and Vite 4.5.14