# StayFinder Backend

A Node.js/Express backend for a StayFinder (Airbnb clone) app.

## Features
- User authentication (JWT)
- Role-based access (host/guest)
- Listings CRUD (host only)
- Booking system (guests)
- MongoDB/Mongoose models
- Security: CORS, helmet, rate limiting, input validation, password hashing
- Sample data seeding

## Setup

1. **Install dependencies**
   ```
   npm install
   ```
2. **Configure environment variables**  
   Create a `.env` file:
   ```
   PORT=5000
   DB_CONNECTION=mongodb://localhost:27017/stayfinder
   JWT_SECRET=your_jwt_secret_here
   ```
3. **Seed sample data**
   ```
   npm run seed
   ```
4. **Start the server**
   ```
   npm run dev
   ```

## API Endpoints
See code comments and route files for details.

## Sample Users
- Host: `host@example.com` / `hostpass`
- Guest: `guest@example.com` / `guestpass`

All responses follow:
```json
{
  "success": true/false,
  "message": "description",
  "data": {},
  "error": {}
}
```
