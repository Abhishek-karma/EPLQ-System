const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Routes for authentication and points of interest
const authRoutes = require('./routes/authRoutes');
const poiRoutes = require('./routes/poiRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS setup to allow requests from your frontend domain (Vercel or local)
app.use(cors({
  origin: ['http://localhost:5173', 'https://eplq-system-bkuf.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON bodies in requests
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/poi', poiRoutes);

// Root route for checking server status
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
