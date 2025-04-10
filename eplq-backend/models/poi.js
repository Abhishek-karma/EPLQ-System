const mongoose = require('mongoose');
const { validateCoordinates } = require('../utils/geoUtils');

const poiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'POI name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['hospital', 'police', 'fire', 'landmark', 'general'],
    default: 'general'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
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
          return validateCoordinates(coords);
        },
        message: props => `Invalid coordinates: ${props.value}`
      }
    }
  },
  encryptedData: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

poiSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('POI', poiSchema);
