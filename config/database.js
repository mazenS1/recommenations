require('dotenv').config();
module.exports = {
  development: {
    username: 'neondb_owner',
    password: 'BHVpN9aX7RIZ',
    database: 'neondb',
    host: 'ep-cool-heart-a2quf4r7-pooler.eu-central-1.aws.neon.tech',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true
      }
    }
  },
  // Add other environments if needed (production, test, etc.)
};