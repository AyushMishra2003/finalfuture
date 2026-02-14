const axios = require('axios');

const LOCATION_IQ_API_KEY = 'pk.2bc21e092c881e1b4035ef20f9da09f6';

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calculate fare based on distance
const calculateFare = (distance) => {
  const baseFare = 50;
  const farePerKm = 12;
  return (baseFare + (distance * farePerKm)).toFixed(2);
};

// Get coordinates from address using LocationIQ
const getCoordinates = async (address) => {
  try {
    const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
      params: {
        key: LOCATION_IQ_API_KEY,
        q: address,
        format: 'json',
        limit: 1
      }
    });
    
    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
        displayName: response.data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('LocationIQ API Error:', error.message);
    return null;
  }
};

// Get address from coordinates using LocationIQ (Reverse Geocoding)
const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://us1.locationiq.com/v1/reverse.php', {
      params: {
        key: LOCATION_IQ_API_KEY,
        lat: latitude,
        lon: longitude,
        format: 'json'
      }
    });
    
    if (response.data) {
      const addr = response.data.address;
      return {
        displayName: response.data.display_name,
        address: addr.road || addr.suburb || '',
        city: addr.city || addr.town || addr.village || '',
        state: addr.state || '',
        country: addr.country || '',
        postcode: addr.postcode || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse Geocoding Error:', error.message);
    return null;
  }
};

// Format distance for display
const formatDistance = (distance) => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(2)} km`;
};

module.exports = {
  calculateDistance,
  calculateFare,
  getCoordinates,
  getAddressFromCoordinates,
  formatDistance
};
