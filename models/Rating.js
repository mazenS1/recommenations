// models/Rating.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./User');
const Movie = require('./Movie');

const Rating = sequelize.define('Rating', {
  rating_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
    allowNull: false,
  },
  movie_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Movie,
      key: 'movie_id',
    },
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'ratings', // Ensure the table name matches the database schema
});

// Add associations
Rating.associate = (models) => {
  Rating.belongsTo(models.Movie, {
    foreignKey: 'movie_id',
    targetKey: 'movie_id'
  });
};

module.exports = Rating;