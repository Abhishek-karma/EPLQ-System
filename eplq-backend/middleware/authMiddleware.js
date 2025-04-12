const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const token = parts[1].trim();
    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    const message = err.name === 'JsonWebTokenError' ? 'Invalid token' : 'Authorization failed';
    res.status(401).json({ 
      success: false,
      message,
      error: err.message 
    });
  }
};

module.exports = authMiddleware;