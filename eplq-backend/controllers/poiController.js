const POI = require('../models/poi');
const { validateCoordinates, encryptLocation, decryptLocation, getCoveringGeohashes, calculateDistance } = require('../utils/geoUtils');

// Admin uploads POI
exports.uploadPOI = async (req, res) => {
  try {
    const { lat, lng, ...poiData } = req.body;

    // Validate coordinates
    if (!validateCoordinates({ lat, lng })) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    // Encrypt location data
    const encryptedData = encryptLocation(lat, lng);
    
    // Generate geohash for search indexing
    const geohash = generateGeohash(lat, lng, 6); // ~1.2km precision

    const newPOI = new POI({
      ...poiData,
      encryptedData,
      geohash,
      createdBy: req.user._id
    });

    await newPOI.save();

    // Return response without sensitive data
    const responseData = newPOI.toObject();
    delete responseData.encryptedData;

    res.status(201).json({
      success: true,
      message: 'POI created successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Upload POI Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// User searches POIs within radius
exports.searchPOIs = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.body;

    // Validate coordinates
    if (!validateCoordinates({ lat, lng })) {
      return res.status(400).json({
        success: false,
        message: 'Invalid search coordinates'
      });
    }

    // Get covering geohash prefixes
    const geohashPrefixes = getCoveringGeohashes(lat, lng, radius);

    // Query database using geohash prefixes
    const pois = await POI.find({
      geohash: { $in: geohashPrefixes }
    }).lean();

    // Decrypt and filter results
    const results = pois
      .map(poi => ({
        ...poi,
        location: decryptLocation(poi.encryptedData)
      }))
      .filter(poi => 
        calculateDistance(
          { lat: parseFloat(lat), lng: parseFloat(lng) },
          poi.location
        ) <= radius
      )
      .map(({ encryptedData, __v, ...rest }) => rest); // Remove sensitive fields

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('Search POIs Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};