const User = require('../models/User');
const Token = require('../models/VerificationToken');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/emailSender');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    const tokenCode = generateToken();
    const token = new Token({ userId: newUser._id, token: tokenCode });
    await token.save();

    await sendEmail(email, 'Your Learnova Verification Code', `Your code is: ${tokenCode}`);

    res.status(201).json({ message: 'Verification code sent to email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, token } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    if (user.isVerified) return res.status(400).json({ message: 'User already verified.' });

    const validToken = await Token.findOne({ userId: user._id, token });
    if (!validToken) return res.status(400).json({ message: 'Invalid or expired token.' });

    user.isVerified = true;
    await user.save();
    await validToken.deleteOne();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
