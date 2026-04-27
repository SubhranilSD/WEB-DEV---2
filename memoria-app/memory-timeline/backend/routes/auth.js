const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_change_in_prod', { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ user, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ user, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('+vaultPin');
  const userObj = user.toJSON();
  userObj.hasVault = !!user.vaultPin;
  res.json(userObj);
});

// Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vault: Setup PIN
router.post('/vault/setup', protect, async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin || pin.length < 4) return res.status(400).json({ message: 'PIN must be at least 4 characters' });
    
    const user = await User.findById(req.user._id);
    user.vaultPin = pin;
    await user.save();
    
    res.json({ message: 'Vault PIN set successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vault: Verify PIN
router.post('/vault/verify', protect, async (req, res) => {
  try {
    const { pin } = req.body;
    const user = await User.findById(req.user._id).select('+vaultPin');
    
    if (!user.vaultPin) return res.status(400).json({ message: 'Vault PIN not set up' });
    
    const isMatch = await user.matchVaultPin(pin);
    if (!isMatch) return res.status(401).json({ message: 'Invalid Vault PIN' });
    
    // Generate a short-lived token for vault access (e.g., 1 hour)
    const vaultToken = jwt.sign({ id: user._id, vault: true }, process.env.JWT_SECRET || 'fallback_secret_key_change_in_prod', { expiresIn: '1h' });
    
    res.json({ vaultToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
