// models/MovieGenre.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const Movie = require('./Movie');
const Genre = require('./Genre');

const MovieGenre = sequelize.define('MovieGenre', {
  movie_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Movie,
      key: 'movie_id',
    },
    primaryKey: true,
  },
  genre_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Genre,
      key: 'genre_id',
    },
    primaryKey: true,
  },
}, {
  timestamps: false,
  tableName: 'movie_genres', // Ensure the table name matches the database schema
});

module.exports = MovieGenre;