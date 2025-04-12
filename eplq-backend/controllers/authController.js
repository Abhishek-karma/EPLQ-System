const authService = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, token }
    });
  } catch (err) {
    res.status(401).json({ 
      success: false,
      error: err.message 
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser };