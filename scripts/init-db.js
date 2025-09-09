#!/usr/bin/env node

require('dotenv').config();
const { sequelize, testConnection } = require('../config/database');
const User = require('../models/User');

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');
  
  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }
    
    // Sync database schema
    console.log('🔄 Synchronizing database schema...');
    
    if (process.env.NODE_ENV === 'production') {
      // In production, only alter existing tables, don't drop
      await sequelize.sync({ alter: true });
      console.log('✅ Database schema synchronized (alter mode)');
    } else {
      // In development, you can force sync (drops tables)
      const force = process.argv.includes('--force');
      await sequelize.sync({ force });
      console.log(`✅ Database schema synchronized ${force ? '(force mode - tables dropped)' : ''}`);
      
      // Create default test user only in development
      if (force) {
        await createDefaultTestUser();
      }
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

async function createDefaultTestUser() {
  console.log('👤 Creating default test user...');
  
  try {
    const existingUser = await User.findByEmail('user@example.com');
    
    if (existingUser) {
      console.log('ℹ️  Default test user already exists, skipping creation');
      return;
    }
    
    const testUser = await User.create({
      email: 'user@example.com',
      username: 'testuser',
      password_hash: 'SecurePassword123!', // Will be hashed by the model hook
      display_name: 'Test User',
      email_verified: true,
      auth_provider: 'local'
    });
    
    console.log('✅ Default test user created successfully');
    console.log('📋 Test credentials:');
    console.log('   Email: user@example.com');
    console.log('   Password: SecurePassword123!');
    
  } catch (error) {
    console.error('❌ Failed to create default test user:', error.message);
    throw error;
  }
}

// Handle script execution
if (require.main === module) {
  initializeDatabase();
}

module.exports = {
  initializeDatabase,
  createDefaultTestUser,
};