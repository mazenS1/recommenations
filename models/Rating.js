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
  media_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['movie', 'tv']]
    }
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
});

Rating.belongsTo(Movie, {
  foreignKey: 'movie_id',
  targetKey: 'movie_id'
});

module.exports = Rating;