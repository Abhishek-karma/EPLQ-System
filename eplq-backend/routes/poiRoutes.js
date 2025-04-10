const express = require('express');
const router = express.Router();
const poiController = require('../controllers/poiController');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Only admin can upload
router.post('/upload', auth, isAdmin, poiController.uploadPOI);

// Any user can search
router.post('/search', auth, poiController.searchPOIs);

module.exports = router;
