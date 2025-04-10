const crypto = require('crypto');
const geohash = require('ngeohash');

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-ctr';

// Encrypt coordinates
const encryptLocation = (lat, lng) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify({ lat, lng })),
    cipher.final()
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// Decrypt coordinates
const decryptLocation = (encrypted) => {
  const [iv, content] = encrypted.split(':');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, 'hex')),
    decipher.final()
  ]);
  return JSON.parse(decrypted.toString());
};

// Generate geohash
const generateGeohash = (lat, lng, precision = 6) => {
  return geohash.encode(lat, lng, precision);
};

// Get covering geohashes for search area
const getCoveringGeohashes = (lat, lng, radius, precision = 6) => {
  const bbox = geohash.bboxes(lat, lng, radius, precision);
  return geohash.bboxesToGeohashes(bbox);
};

// Validate coordinates
const validateCoordinates = (coords) => {
  try {
    const lat = parseFloat(coords.lat);
    const lng = parseFloat(coords.lng);
    return (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  } catch (e) {
    return false;
  }
};

// Calculate distance between points
const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = point1.lat * Math.PI/180;
  const φ2 = point2.lat * Math.PI/180;
  const Δφ = (point2.lat - point1.lat) * Math.PI/180;
  const Δλ = (point2.lng - point1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) ** 2 + 
            Math.cos(φ1) * Math.cos(φ2) * 
            Math.sin(Δλ/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

module.exports = {
  validateCoordinates,
  encryptLocation,
  decryptLocation,
  generateGeohash,
  getCoveringGeohashes,
  calculateDistance
};