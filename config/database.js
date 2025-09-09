const { Sequelize } = require('sequelize');

// Database configuration with connection pooling and security best practices
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Security and performance configurations
    pool: {
      max: 10,        // Maximum number of connections in pool
      min: 2,         // Minimum number of connections in pool
      acquire: 30000, // Maximum time (ms) to try getting connection
      idle: 10000,    // Maximum time (ms) a connection can be idle
    },
    
    // Security configurations
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false // For cloud databases like Heroku Postgres
      } : false,
      
      // Additional security options
      connectTimeout: 30000,
      requestTimeout: 30000,
    },
    
    // Query options for security
    define: {
      // Automatically add createdAt and updatedAt timestamps
      timestamps: true,
      // Use snake_case for automatically generated attributes
      underscored: true,
      // Prevent deletion of records, use soft deletes instead
      paranoid: true,
      // Freeze table names (don't pluralize)
      freezeTableName: true,
    },
    
    // Timezone configuration
    timezone: '+00:00', // UTC timezone
  })
  : new Sequelize(
    process.env.DATABASE_NAME || 'secure_web_server',
    process.env.DATABASE_USER || 'postgres',
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      
      // Security and performance configurations
      pool: {
        max: 10,        // Maximum number of connections in pool
        min: 2,         // Minimum number of connections in pool
        acquire: 30000, // Maximum time (ms) to try getting connection
        idle: 10000,    // Maximum time (ms) a connection can be idle
      },
      
      // Security configurations
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false // For cloud databases like Heroku Postgres
        } : false,
        
        // Additional security options
        connectTimeout: 30000,
        requestTimeout: 30000,
      },
      
      // Query options for security
      define: {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
        // Use snake_case for automatically generated attributes
        underscored: true,
        // Prevent deletion of records, use soft deletes instead
        paranoid: true,
        // Freeze table names (don't pluralize)
        freezeTableName: true,
      },
      
      // Timezone configuration
      timezone: '+00:00', // UTC timezone
    }
  );

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    
    // Log specific connection issues for debugging
    if (error.name === 'ConnectionError') {
      console.error('Connection details:');
      console.error(`- Host: ${process.env.DATABASE_HOST || 'localhost'}`);
      console.error(`- Port: ${process.env.DATABASE_PORT || 5432}`);
      console.error(`- Database: ${process.env.DATABASE_NAME || 'secure_web_server'}`);
    }
    
    return false;
  }
};

// Graceful database shutdown
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
};

// Handle application shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database connection...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database connection...');
  await closeConnection();
  process.exit(0);
});

module.exports = {
  sequelize,
  testConnection,
  closeConnection,
};