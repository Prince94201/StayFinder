require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/bookings', require('./routes/bookings'));

// Error Handler
app.use(errorHandler);

// DB Connection
mongoose.connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
