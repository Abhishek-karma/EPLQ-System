const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();

  // Return user without password
  const userResponse = newUser.toObject();
  delete userResponse.password;
  return userResponse;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  

  // Return user without password
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

const getUserById = async (userId) => {
  return await User.findById(userId).select('-password');
};

module.exports = {
  register,
  login,
  getUserById
};

module.exports = { register, login, getUserById };