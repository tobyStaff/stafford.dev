#!/usr/bin/env node

require('dotenv').config();
const { sequelize, testConnection } = require('../config/database');
const User = require('../models/User');
const Prediction = require('../models/Prediction');

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
      
      // Create default test user and sample data only in development
      if (force) {
        await createDefaultTestUser();
        await createSamplePredictions();
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

async function createSamplePredictions() {
  console.log('📊 Creating sample prediction data...');

  try {
    const existingCount = await Prediction.count();

    if (existingCount > 0) {
      console.log('ℹ️  Sample predictions already exist, skipping creation');
      return;
    }

    const samplePredictions = [
      {
        content: "AI will replace 35% of software engineering jobs by 2028. The rise of GitHub Copilot shows we're already seeing this trend accelerate in development workflows.",
        author_name: "@techguru2024",
        author_handle: "@techguru2024",
        author_platform: "Twitter",
        topic: "Technology",
        subtopic: "AI Impact",
        sentiment: -0.2,
        confidence: 0.75,
        likes: 1247,
        shares: 89,
        comments: 156,
        prediction_subject: "Software Engineering Jobs",
        prediction_outcome: "35% job displacement",
        prediction_timeframe: "by 2028",
        x_coordinate: 25.5,
        y_coordinate: 18.7,
        source_url: "https://twitter.com/techguru2024/status/12345",
      },
      {
        content: "Bitcoin will hit $150000 before the end of 2025. Rising institutional adoption will drive massive inflows from pension funds and sovereign wealth.",
        author_name: "@cryptooracle",
        author_handle: "@cryptooracle",
        author_platform: "Twitter",
        topic: "Economics",
        subtopic: "Cryptocurrency",
        sentiment: 0.8,
        confidence: 0.65,
        likes: 892,
        shares: 234,
        comments: 67,
        prediction_subject: "Bitcoin Price",
        prediction_outcome: "$150,000 USD",
        prediction_timeframe: "by end of 2025",
        x_coordinate: 22.1,
        y_coordinate: 78.3,
      },
      {
        content: "The Warriors will win the 2025 NBA Championship. Curry's leadership and the team's depth will be legendary this season.",
        author_name: "@sportsfan_bay",
        author_handle: "@sportsfan_bay",
        author_platform: "Twitter",
        topic: "Sports",
        subtopic: "NBA",
        sentiment: 0.9,
        confidence: 0.55,
        likes: 445,
        shares: 78,
        comments: 234,
        prediction_subject: "NBA Championship",
        prediction_outcome: "Warriors victory",
        prediction_timeframe: "2025 season",
        x_coordinate: 83.2,
        y_coordinate: 82.1,
      },
      {
        content: "Climate change will cause major flooding in Southeast Asia by 2026. The recent storms and rising sea levels are just the beginning.",
        author_name: "Climate Researcher",
        author_handle: "Climate Researcher",
        author_platform: "LinkedIn",
        topic: "Science",
        subtopic: "Climate Change",
        sentiment: -0.7,
        confidence: 0.85,
        likes: 156,
        shares: 45,
        comments: 89,
        prediction_subject: "Climate Impact",
        prediction_outcome: "Major flooding in Southeast Asia",
        prediction_timeframe: "by 2026",
        x_coordinate: 48.7,
        y_coordinate: 72.4,
      },
      {
        content: "Disney+ will overtake Netflix in subscribers by 2026. Their content pipeline and pricing strategy will dominate streaming.",
        author_name: "@streamingexpert",
        author_handle: "@streamingexpert",
        author_platform: "Twitter",
        topic: "Entertainment",
        subtopic: "Streaming",
        sentiment: 0.3,
        confidence: 0.45,
        likes: 321,
        shares: 56,
        comments: 123,
        prediction_subject: "Streaming Market",
        prediction_outcome: "Disney+ overtakes Netflix",
        prediction_timeframe: "by 2026",
        x_coordinate: 52.3,
        y_coordinate: 28.9,
      },
      {
        content: "Biden will win the 2024 Presidential Election with 52% of the vote. The economy and healthcare will be decisive factors.",
        author_name: "@politicalanalyst",
        author_handle: "@politicalanalyst",
        author_platform: "Twitter",
        topic: "Politics",
        subtopic: "Elections",
        sentiment: 0.1,
        confidence: 0.70,
        likes: 678,
        shares: 123,
        comments: 289,
        prediction_subject: "2024 Presidential Election",
        prediction_outcome: "Biden victory with 52%",
        prediction_timeframe: "2024 election",
        x_coordinate: 79.4,
        y_coordinate: 21.6,
      }
    ];

    await Prediction.bulkCreate(samplePredictions);

    console.log(`✅ Created ${samplePredictions.length} sample predictions`);
    console.log('📋 Sample topics: Technology, Economics, Sports, Science, Entertainment, Politics');

  } catch (error) {
    console.error('❌ Failed to create sample predictions:', error.message);
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
  createSamplePredictions,
};