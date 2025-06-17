const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { register, login, profile } = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  body('role').optional().isIn(['guest', 'host'])
], validate, register);

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], validate, login);

// Profile (protected)
router.get('/profile', auth, profile);

module.exports = router;
