const POI = require('../models/poi');
const { 
  validateCoordinates,
  encryptLocation,
  decryptLocation,
  generateGeohash,
  getCoveringGeohashes,
  calculateDistance
} = require('../utils/geoUtils');

exports.uploadPOI = async (req, res) => {
  try {
    const { lat, lng, ...poiData } = req.body;

    // Validate input coordinates
    if (!validateCoordinates({ lat, lng })) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Use valid lat(-90 to 90) and lng(-180 to 180)'
      });
    }

    // Encrypt sensitive location data
    const encryptedData = encryptLocation(lat, lng);
    
    // Generate searchable geohash
    const geohash = generateGeohash(lat, lng, 6); // ~1.2km precision

    // Create new POI document
    const newPOI = await POI.create({
      ...poiData,
      encryptedData,
      geohash,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
      },
      createdBy: req.user._id
    });

    // Return response without sensitive data
    const responseData = newPOI.toObject();
    delete responseData.encryptedData;
    delete responseData.__v;

    res.status(201).json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(error.name === 'ValidationError' ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
};

exports.searchPOIs = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, name, type } = req.body;

    const query = {};

    // If coordinates are provided, add geohash-based filtering
    let useGeoFilter = validateCoordinates({ lat, lng }) && radius > 0;
    if (useGeoFilter) {
      const patterns = getCoveringGeohashes(lat, lng, radius);
      if (!patterns.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid geolocation search area'
        });
      }
      query.geohash = { $regex: new RegExp(`^(${patterns.join('|')})`) };
    }

    // Optional name filter (case-insensitive partial match)
    if (name && name.trim() !== '') {
      query.name = { $regex: new RegExp(name.trim(), 'i') };
    }

    // Optional type filter (exact match)
    if (type && type.trim() !== '') {
      query.type = type.trim();
    }

    const pois = await POI.find(query).lean();

    res.status(200).json({
      success: true,
      count: pois.length,
      data: pois.map(poi => ({
        ...poi,
        location: {
          lat: poi.location.coordinates[1],
          lng: poi.location.coordinates[0]
        }
      }))
    });

  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
};


