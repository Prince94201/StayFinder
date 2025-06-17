const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/bookingController');

const router = express.Router();

// Create booking (protected)
router.post('/', auth, [
  body('listingId').notEmpty(),
  body('checkIn').isISO8601(),
  body('checkOut').isISO8601()
], validate, ctrl.create);

// Get user's bookings (protected)
router.get('/user', auth, ctrl.userBookings);

// Get host's property bookings (protected)
router.get('/host', auth, ctrl.hostBookings);

router.put('/:id', auth, [
  body('status').isIn(['pending', 'confirmed', 'cancelled'])
], ctrl.updateBooking);

module.exports = router;
