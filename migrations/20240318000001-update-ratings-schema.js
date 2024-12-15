'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop metadata since we'll get it from movies table
    await queryInterface.removeColumn('ratings', 'metadata');

    // Rename media_id to movie_id
    await queryInterface.renameColumn('ratings', 'media_id', 'movie_id');

    // Add foreign key constraint
    await queryInterface.addConstraint('ratings', {
      fields: ['movie_id'],
      type: 'foreign key',
      name: 'ratings_movie_id_fkey',
      references: {
        table: 'movies',
        field: 'movie_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraint
    await queryInterface.removeConstraint('ratings', 'ratings_movie_id_fkey');

    // Rename movie_id back to media_id
    await queryInterface.renameColumn('ratings', 'movie_id', 'media_id');

    // Add back metadata column
    await queryInterface.addColumn('ratings', 'metadata', {
      type: Sequelize.JSONB,
      allowNull: true
    });
  }
}; 