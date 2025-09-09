const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  
  username: {
    type: DataTypes.STRING(30),
    allowNull: true,
    unique: true,
    validate: {
      len: [3, 30],
      isAlphanumeric: true,
    },
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [5, 255],
    },
  },
  
  password_hash: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable for OAuth-only users
  },
  
  // OAuth fields
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  
  // Profile information
  display_name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 100],
    },
  },
  
  profile_photo_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  
  // Account status
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  
  // Security fields
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  failed_login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  
  account_locked_until: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // OAuth provider
  auth_provider: {
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local',
    allowNull: false,
  },
  
}, {
  // Model options
  tableName: 'users',
  timestamps: true,
  paranoid: true, // Soft deletes
  underscored: true,
  
  // Indexes for performance and security
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
    {
      unique: true,
      fields: ['username'],
      where: {
        username: {
          [sequelize.Sequelize.Op.ne]: null
        }
      }
    },
    {
      unique: true,
      fields: ['google_id'],
      where: {
        google_id: {
          [sequelize.Sequelize.Op.ne]: null
        }
      }
    },
    {
      fields: ['is_active'],
    },
    {
      fields: ['auth_provider'],
    },
    {
      fields: ['created_at'],
    },
  ],
  
  // Hooks for password hashing and validation
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
      user.email = user.email.toLowerCase().trim();
      if (user.username) {
        user.username = user.username.toLowerCase().trim();
      }
    },
    
    beforeUpdate: async (user) => {
      if (user.changed('password_hash') && user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
      if (user.changed('email')) {
        user.email = user.email.toLowerCase().trim();
      }
      if (user.changed('username') && user.username) {
        user.username = user.username.toLowerCase().trim();
      }
    },
  },
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  if (!this.password_hash) {
    return false; // OAuth users don't have passwords
  }
  return await bcrypt.compare(password, this.password_hash);
};

User.prototype.incrementFailedAttempts = async function() {
  this.failed_login_attempts += 1;
  
  // Lock account after 5 failed attempts for 15 minutes
  if (this.failed_login_attempts >= 5) {
    this.account_locked_until = new Date(Date.now() + 15 * 60 * 1000);
  }
  
  await this.save();
};

User.prototype.resetFailedAttempts = async function() {
  if (this.failed_login_attempts > 0 || this.account_locked_until) {
    this.failed_login_attempts = 0;
    this.account_locked_until = null;
    await this.save();
  }
};

User.prototype.isLocked = function() {
  return this.account_locked_until && this.account_locked_until > new Date();
};

User.prototype.updateLastLogin = async function() {
  this.last_login = new Date();
  await this.save();
};

User.prototype.toSafeJSON = function() {
  const userData = this.toJSON();
  delete userData.password_hash;
  delete userData.deleted_at;
  delete userData.failed_login_attempts;
  delete userData.account_locked_until;
  return userData;
};

// Class methods
User.findByEmail = async function(email) {
  return await this.findOne({
    where: {
      email: email.toLowerCase().trim(),
      is_active: true,
    },
  });
};

User.findByGoogleId = async function(googleId) {
  return await this.findOne({
    where: {
      google_id: googleId,
      is_active: true,
    },
  });
};

User.findByUsername = async function(username) {
  return await this.findOne({
    where: {
      username: username.toLowerCase().trim(),
      is_active: true,
    },
  });
};

User.createUser = async function(userData) {
  return await this.create(userData);
};

module.exports = User;