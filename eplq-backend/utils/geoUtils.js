const crypto = require('crypto');
const geohash = require('ngeohash'); // ✅ Correct geohash library

// Encryption setup
const secret = process.env.GEO_SECRET || '1234567890abcdef1234567890abcdef';
const ENCRYPTION_KEY = secret.padEnd(64, '0').slice(0, 64);
const ALGORITHM = 'aes-256-ctr';

// Encrypt location data
exports.encryptLocation = (lat, lng) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify({ lat, lng })),
    cipher.final()
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// Decrypt location data
exports.decryptLocation = (encrypted) => {
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

// Validate coordinate format
exports.validateCoordinates = (coords) => {
  try {
    const lat = Number(coords.lat);
    const lng = Number(coords.lng);
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

// Generate geohash for indexing
exports.generateGeohash = (lat, lng, precision = 6) => {
  return geohash.encode(lat, lng, precision);
};

// Get covering geohashes for search area
exports.getCoveringGeohashes = (lat, lng, radius) => {
  try {
    const precision = 6; // Match upload precision
    const { min, max } = geohash.bboxes(lat, lng, radius, precision);
    const prefixes = new Set();
    
    // Simple prefix expansion
    for (let hash of [min, max]) {
      prefixes.add(hash.substring(0, precision));
    }
    
    return Array.from(prefixes);
  } catch (error) {
    console.error('Geohash Error:', error);
    return [];
  }
};
// Generate geohashes from bounding box
function bboxesToGeohashes(bbox, precision) {
  const [minLat, minLon, maxLat, maxLon] = bbox;
  const geohashes = new Set();

  for (let lat = minLat; lat <= maxLat; lat += 0.01) {
    for (let lon = minLon; lon <= maxLon; lon += 0.01) {
      geohashes.add(geohash.encode(lat, lon, precision));
    }
  }

  return Array.from(geohashes);
}

// Calculate distance between two points (in meters)
exports.calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = point1.lat * Math.PI / 180;
  const φ2 = point2.lat * Math.PI / 180;
  const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
  const Δλ = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
