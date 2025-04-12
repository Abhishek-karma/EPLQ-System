const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const serverless = require('serverless-http'); 

const authRoutes = require('./routes/authRoutes');
const poiRoutes = require('./routes/poiRoutes');

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://eplq-system-bkuf.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/poi', poiRoutes);

app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err));

module.exports.handler = serverless(app); 

