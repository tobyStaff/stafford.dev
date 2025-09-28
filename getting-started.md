# Getting Started

This guide will help you set up and run the Stafford.dev portfolio website locally.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=your_postgresql_connection_string
# OR individual database settings:
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_database_name
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# Authentication
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CORS
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

### 3. Database Setup

Initialize the PostgreSQL database:

```bash
# Create database tables
npm run init-db

# Or force recreate (drops existing data)
npm run init-db-force
```

## Running the Application

You have two options for running the application:

### Option A: Development Mode (Recommended)

Run both the Express server and React development server separately for the best development experience:

**Terminal 1 - Start Express Server:**
```bash
npm run server
```
The Express server will run on http://localhost:3000

**Terminal 2 - Start React Development Server:**
```bash
cd client
npm run dev
```
The React dev server will run on http://localhost:3001

**Access the application:** http://localhost:3001

### Option B: Production Mode

Build the React client and serve everything through the Express server:

```bash
# Build the React client
npm run build

# Start the Express server
npm run server
```

**Access the application:** http://localhost:3000

## Development Workflow

### Making Changes

- **Backend changes:** Edit files in the root directory, restart with `npm run server`
- **Frontend changes:** Edit files in `client/src/`, changes auto-reload at http://localhost:3001
- **Database changes:** Modify models in `models/` directory, restart server

### API Development

- API endpoints are available at `/api/*` routes
- Authentication endpoints at `/auth/*`
- All API calls from the React dev server are automatically proxied to the Express server

### Building for Production

```bash
# Build React client
npm run build

# Test production build locally
npm run server
# Access at http://localhost:3000
```

## Port Configuration

### Default Ports
- **Express Server:** 3000 (configurable via PORT environment variable)
- **React Dev Server:** 3001 (configured in `client/vite.config.js`)

### Changing Ports

**Express Server Port:**
```bash
# Set in .env file
PORT=3001

# Or run with custom port
PORT=3001 npm run server
```

**React Dev Server Port:**
Edit `client/vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3002, // Change this value
    // ...
  }
})
```

## Troubleshooting

### Common Issues

**Assets fail to load:**
- Ensure you've built the React client: `npm run build`
- Check that both servers are running in development mode

**Database connection errors:**
- Verify PostgreSQL is running
- Check `.env` database configuration
- Run `npm run init-db` to create tables

**Port conflicts:**
- Kill processes on conflicting ports: `lsof -ti:3000 | xargs kill -9`
- Change ports in configuration files

**CORS errors:**
- Ensure `ALLOWED_ORIGINS` in `.env` includes your client URL
- Check that API calls are being proxied correctly in development

### Useful Commands

```bash
# Check what's running on specific ports
lsof -i :3000
lsof -i :3001

# View server logs
npm run logs

# Lint client code
cd client && npm run lint

# Run database initialization
npm run init-db
```

## Project Structure

```
stafford.dev/
├── client/                 # React frontend
│   ├── src/               # React source code
│   ├── dist/              # Built client files
│   └── vite.config.js     # Vite configuration
├── routes/                # Express API routes
├── models/                # Database models
├── config/                # Configuration files
├── scripts/               # Deployment scripts
├── server.js              # Express server
├── .env                   # Environment variables
└── package.json           # Backend dependencies
```

## Next Steps

- Access the application at http://localhost:3001 (development) or http://localhost:3000 (production)
- Check out the API documentation in the codebase
- Explore the React components in `client/src/`
- Review the authentication flow in `routes/auth.js`