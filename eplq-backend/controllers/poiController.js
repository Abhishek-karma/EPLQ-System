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

    // Validate coordinates
    if (!validateCoordinates({ lat, lng }) || radius <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates or radius'
      });
    }

    // Generate geohash prefixes
    const geohashPrefixes = getCoveringGeohashes(lat, lng, radius);
    if (!geohashPrefixes.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid search area'
      });
    }

    // Build simple query
    const query = {
      geohash: { $in: geohashPrefixes },
      ...(name && { name: new RegExp(name, 'i') }),
      ...(type && validTypes.includes(type) && { type })
    };

    // Execute query
    const pois = await POI.find(query)
      .select('name type location createdAt')
      .lean();

    // Filter results by distance
    const results = pois.filter(poi => 
      calculateDistance(
        { lat: parseFloat(lat), lng: parseFloat(lng) },
        {
          lat: poi.location.coordinates[1],
          lng: poi.location.coordinates[0]
        }
      ) <= radius
    );

    res.json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
};