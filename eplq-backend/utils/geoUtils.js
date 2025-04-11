const crypto = require('crypto');
const geohash = require('ngeohash');

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

// Bounding box calculation
function getBoundingBox(lat, lng, radius) {
  const earthRadius = 6371e3; // meters
  const dLat = (radius / earthRadius) * (180 / Math.PI);
  const dLng = dLat / Math.cos((lat * Math.PI) / 180);

  return {
    minLat: lat - dLat,
    maxLat: lat + dLat,
    minLng: lng - dLng,
    maxLng: lng + dLng
  };
}

// Generate geohashes for the bounding box
function bboxesToGeohashes(bbox, precision) {
  const { minLat, minLng, maxLat, maxLng } = bbox;
  const geohashes = new Set();
  const latStep = 0.01;
  const lngStep = 0.01;

  for (let lat = minLat; lat <= maxLat; lat += latStep) {
    for (let lng = minLng; lng <= maxLng; lng += lngStep) {
      geohashes.add(geohash.encode(lat, lng, precision));
    }
  }

  return Array.from(geohashes);
}

// Get covering geohashes
exports.getCoveringGeohashes = (lat, lng, radius) => {
  try {
    const precision = 6;
    const bbox = getBoundingBox(lat, lng, radius);
    return bboxesToGeohashes(bbox, precision);
  } catch (error) {
    console.error('Geohash Error:', error.message);
    return [];
  }
};

// Calculate distance between two points (in meters)
exports.calculateDistance = (point1, point2) => {
  const R = 6371e3;
  const φ1 = point1.lat * Math.PI / 180;
  const φ2 = point2.lat * Math.PI / 180;
  const Δφ = (point2.lat - point1.lat) * Math.PI / 180;
  const Δλ = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
