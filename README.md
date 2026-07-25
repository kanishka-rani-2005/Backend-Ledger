# Backend Ledger

A Node.js backend for ledger management with user authentication, account handling, transaction processing, and email notifications.

## Description

This repository provides a REST API backend built with Express and MongoDB. It supports:
- user registration and login
- JWT-based authentication
- account creation and balance retrieval
- transaction creation and history tracking
- email notifications for registration and transaction events

## Folder Structure

- `server.js` - application entry point
- `.env` - example environment variables for deployment
- `src/app.js` - Express app configuration and middleware setup
- `src/db/db.js` - MongoDB connection logic
- `src/controllers/` - route controllers for auth, accounts, and transactions
- `src/middleware/` - authentication middleware
- `src/models/` - Mongoose schemas and models
- `src/routes/` - API route definitions
- `src/services/` - reusable services such as email delivery

## Deployment

1. Copy `.env.example` to `.env`
2. Set `MONGODB_URI`, `JWT_SECRET_TOKEN`, and email credentials
3. Run `npm install`
4. Start with `npm start`

## Environment Variables

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET_TOKEN`
- `EMAIL_USER`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `REFRESH_TOKEN`

## Run Command

- Use `npm run dev` for local development with automatic restart


## Deployed Link

https://backend-ledger-mxyo.onrender.com/