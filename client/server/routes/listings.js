const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const ctrl = require('../controllers/listingController');

const router = express.Router();

// Get all active listings with optional filters
router.get('/', ctrl.getAll);

// Get single listing with host details
router.get('/:id', ctrl.getOne);

// Create new listing (host only)
router.post('/', auth, role('host'), [
  body('title').notEmpty(),
  body('price').isNumeric(),
  body('location').notEmpty(),
  body('maxGuests').isNumeric(),
  body('bedrooms').isNumeric(),
  body('bathrooms').isNumeric()
], validate, ctrl.create);

// Update own listing (host only)
router.put('/:id', auth, role('host'), validate, ctrl.update);

// Soft delete own listing (host only)
router.delete('/:id', auth, role('host'), ctrl.remove);

module.exports = router;
