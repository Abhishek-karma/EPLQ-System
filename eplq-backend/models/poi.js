const mongoose = require('mongoose');
const { validateCoordinates } = require('../utils/geoUtils');

const poiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'POI name is required'],
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['hospital', 'police', 'fire', 'landmark', 'general','school','gov_office','religious'],
    default: 'general'
  },
  description: {
    type: String,
    maxlength: 500
  },
  encryptedData: {
    type: String,
    required: true
  },
  geohash: {
    type: String,
    index: true,
    required: true,
    validate: {
      validator: (v) => /^[0123456789bcdefghjkmnpqrstuvwxyz]{6}$/.test(v),
      message: 'Invalid geohash format'
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return validateCoordinates({ lng: coords[0], lat: coords[1] });
        },
        message: 'Invalid GeoJSON coordinates [lng, lat]'
      }
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Compound index for efficient queries
poiSchema.index({ geohash: 1, type: 1, name: 1  });

module.exports = mongoose.model('POI', poiSchema);