const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, phone, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already exists', data: {}, error: {} });
    }
    const user = await User.create({ email, password, name, phone, role });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: 'User registered', data: { token }, error: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', data: {}, error: err.message || err });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ success: false, message: 'Invalid credentials', data: {}, error: {} });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: 'Login successful', data: { token }, error: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', data: {}, error: err.message || err });
  }
};

exports.profile = async (req, res) => {
  res.json({ success: true, message: 'Profile fetched', data: req.user, error: {} });
};
