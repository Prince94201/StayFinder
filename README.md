# StayFinder

A full-stack Airbnb clone platform where users can list, discover, and book accommodations. The application allows hosts to add and manage property listings, while guests can browse, search, and book stays. The project aims to provide a seamless, secure, and user-friendly experience for both hosts and guests, demonstrating modern web development practices using React, TypeScript, Vite, Tailwind CSS (frontend) and Node.js, Express, MongoDB (backend).

## Features

- User authentication (JWT)
- Role-based access (host/guest)
- Listings CRUD (host only)
- Booking system (guests)
- MongoDB/Mongoose models
- Security: CORS, helmet, rate limiting, input validation, password hashing
- Sample data seeding

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (for local development)

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

#### 2. Install dependencies

```sh
cd client
npm install
cd ../server
npm install
```

#### 3. Configure environment variables

Create `.env` files in both `client/` and `server/` as needed.  
Example for backend (`server/.env`):

```
PORT=5000
DB_CONNECTION=mongodb://localhost:27017/stayfinder
JWT_SECRET=your_jwt_secret_here
```

#### 4. Seed sample data (backend)

```sh
npm run seed
```

#### 5. Run locally

- **Frontend:**  
  ```sh
  cd client
  npm run dev
  ```
- **Backend:**  
  ```sh
  cd server
  npm run dev
  ```

## API Endpoints

See code comments and route files for details.

## Sample Users

- Host: `host@example.com` / `hostpass`
- Guest: `guest@example.com` / `guestpass`

## License

MIT

---

> _Deployed on Netlify (frontend) and Render (backend)._
