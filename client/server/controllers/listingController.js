const Listing = require('../models/Listing');

exports.getAll = async (req, res, next) => {
  try {
    const { location, minPrice, maxPrice, maxGuests } = req.query;
    let filter = { isActive: true };
    if (location) filter.location = new RegExp(location, 'i');
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (maxGuests) filter.maxGuests = { $gte: Number(maxGuests) };
    const listings = await Listing.find(filter).populate('hostId', 'name email');
    res.json({ success: true, message: 'Listings fetched', data: listings, error: {} });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('hostId', 'name email phone');
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found', data: {}, error: {} });
    res.json({ success: true, message: 'Listing fetched', data: listing, error: {} });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, hostId: req.user._id };
    const listing = await Listing.create(data);
    res.status(201).json({ success: true, message: 'Listing created', data: listing, error: {} });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, hostId: req.user._id },
      req.body,
      { new: true }
    );
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found or unauthorized', data: {}, error: {} });
    res.json({ success: true, message: 'Listing updated', data: listing, error: {} });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, hostId: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found or unauthorized', data: {}, error: {} });
    res.json({ success: true, message: 'Listing deleted', data: listing, error: {} });
  } catch (err) { next(err); }
};
