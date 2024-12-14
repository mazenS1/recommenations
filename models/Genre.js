// models/Genre.js
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Genre = sequelize.define('Genre', {
  genre_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'genres', // Ensure the table name matches the database schema
});

// Add associations
Genre.associate = (models) => {
  Genre.belongsToMany(models.Movie, {
    through: 'movie_genres',
    foreignKey: 'genre_id',
    otherKey: 'movie_id'
  });
};

module.exports = Genre;