# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack portfolio website with a secure Express.js backend and React frontend (stafford.dev). The application emphasizes security features including JWT authentication, rate limiting, PostgreSQL database integration, and comprehensive input validation.

## Common Commands

### Development
- `npm run dev` - Start development server (uses scripts/dev-server.sh)
- `npm run server` - Start production server directly with node
- `npm start` - Start production server using PM2 (scripts/start-server.sh)
- `npm stop` - Stop production server (scripts/stop-server.sh)
- `npm restart` - Restart production server (scripts/restart-server.sh)

### Client (React + Vite)
- `cd client && npm run dev` - Start React development server
- `npm run build` - Build React client for production
- `cd client && npm run lint` - Run ESLint on client code

### Database
- `npm run init-db` - Initialize PostgreSQL database with tables
- `npm run init-db-force` - Force reinitialize database (drops existing)

### Deployment
- `npm run deploy` - Full deployment script
- `npm run quick-deploy` - Quick deployment without full rebuild
- `npm run status` - Check server status
- `npm run logs` - View server logs

## Architecture

### Backend Structure
- **server.js** - Main Express server with security middleware, authentication, and route setup
- **routes/** - API route handlers
  - `auth.js` - Authentication endpoints (login, register, Google OAuth)
  - `home.js` - Portfolio content and protected routes
  - `admin.js` - Admin-only endpoints
  - `portfolio.js` - Portfolio data endpoints
- **models/** - Sequelize ORM models
  - `User.js` - User model with password hashing and account lockout
- **config/** - Configuration files
  - `database.js` - PostgreSQL connection and Sequelize setup
- **scripts/** - Deployment and maintenance scripts

### Frontend Structure (client/)
- **React 19** with **Vite** build system
- **Tailwind CSS** for styling with forms and typography plugins
- **React Router** for client-side routing
- **Axios** for API communication
- **src/components/** - Reusable React components
- **src/pages/** - Page-level components

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
- Server: `PORT`, `NODE_ENV`

## Testing

The project includes integration testing (`test-integration.js`) for API endpoints. Test authentication by:
1. Register user via `POST /api/register`
2. Login via `POST /api/login` to get JWT
3. Access protected routes with `Authorization: Bearer <token>` header