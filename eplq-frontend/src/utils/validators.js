export const validateCoordinates = ({ lat, lng }) => {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    return (
      !isNaN(numLat) &&
      !isNaN(numLng) &&
      numLat >= -90 &&
      numLat <= 90 &&
      numLng >= -180 &&
      numLng <= 180
    );
  };