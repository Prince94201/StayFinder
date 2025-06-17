const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

exports.create = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      return res.status(404).json({ success: false, message: 'Listing not found', data: {}, error: {} });
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate < new Date() || checkOutDate <= checkInDate) {
      return res.status(400).json({ success: false, message: 'Invalid dates', data: {}, error: {} });
    }
    // Check for overlapping bookings
    const overlap = await Booking.findOne({
      listingId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } }
      ]
    });
    if (overlap) {
      return res.status(400).json({ success: false, message: 'Listing not available for selected dates', data: {}, error: {} });
    }
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * listing.price;
    const booking = await Booking.create({
      listingId,
      guestId: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice
    });
    res.status(201).json({ success: true, message: 'Booking created', data: booking, error: {} });
  } catch (err) { next(err); }
};

exports.userBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guestId: req.user._id })
      .populate('listingId');

    const formattedBookings = bookings.map(b => ({
      ...b.toObject(),
      id: b._id,
      listing: b.listingId,
    }));

    res.json({ success: true, message: 'User bookings fetched', data: formattedBookings, error: {} });
  } catch (err) { next(err); }
};

exports.hostBookings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ hostId: req.user._id });
    const bookings = await Booking.find({ listingId: { $in: listings.map(l => l._id) } })
      .populate('listingId guestId');

    const formattedBookings = bookings.map(b => ({
      ...b.toObject(),
      id: b._id,
      listing: b.listingId,
      guest: b.guestId,
    }));

    res.json({ success: true, message: 'Host bookings fetched', data: formattedBookings, error: {} });
  } catch (err) { next(err); }
};

exports.updateBooking = async (req, res, next) => {
  try {
    console.log('Updating booking with ID:', req.params.id);
    const { status } = req.body;
    console.log('New status:', status);
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status', data: {}, error: {} });
    }
    console.log('Finding booking...');
    const b = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('listingId guestId');
      console.log('Booking found:', b);
      const formattedBookings = {
        ...b.toObject(),
        id: b._id,
        listing: b.listingId,
        guest: b.guestId,
      };
    if (!b) {
      return res.status(404).json({ success: false, message: 'Booking not found', data: {}, error: {} });
    }
    res.json({ success: true, message: 'Booking updated', data: formattedBookings, error: {} });
  } catch (err) { next(err); }
};
