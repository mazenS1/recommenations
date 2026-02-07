# Recommendations App

A full-stack web application for managing recommendations, built with Node.js/Express backend and React frontend.

## Overview

This application provides a platform for users to create, manage, and share recommendations. It features user authentication, rate limiting, and a modern responsive interface.

## Features

- User authentication and authorization with JWT
- Secure password hashing with bcrypt
- Rate limiting to prevent abuse
- RESTful API architecture
- Sequelize ORM with PostgreSQL database
- React frontend with Vite
- Responsive UI with Tailwind CSS
- Redis-based rate limiting with Upstash

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcrypt
- **Rate Limiting**: express-rate-limit, Upstash Redis
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/mazenS1/recommenations.git
cd recommenations
```

2. Install dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
PORT=3000
```

5. Run database migrations:
```bash
npm run migrate
```

## Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run them separately:

Server only:
```bash
npm run server
```

Client only:
```bash
npm run client
```

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Project Structure

```
recommenations/
├── client/              # React frontend
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Express middleware
├── migrations/          # Database migrations
├── models/              # Sequelize models
├── routes/              # API routes
├── index.js            # Application entry point
├── Dockerfile          # Docker configuration
├── fly.toml            # Fly.io deployment config
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Run server and client in development mode
- `npm run server` - Run server only with nodemon
- `npm run client` - Run client only
- `npm run build` - Build both server and client for production
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

## Deployment

The application is configured for deployment on:
- **Docker**: Using the included Dockerfile
- **Fly.io**: Configuration in fly.toml
- **Vercel**: Client can be deployed separately

## License

