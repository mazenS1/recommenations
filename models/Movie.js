// models/Movie.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Movie = sequelize.define('Movie', {
  movie_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  release_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
}, {
  timestamps: false,
  tableName: 'movies', // Ensure the table name matches the database schema
});

// Add associations
Movie.associate = (models) => {
  Movie.hasMany(models.Rating, {
    foreignKey: 'movie_id',
    sourceKey: 'movie_id'
  });
  Movie.belongsToMany(models.Genre, {
    through: 'movie_genres',
    foreignKey: 'movie_id',
    otherKey: 'genre_id'
  });
};

module.exports = Movie;