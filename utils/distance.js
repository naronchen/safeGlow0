export const deg2rad = (deg) => deg * (Math.PI / 180);

export const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in kilometers.
  const dLat = deg2rad(coord2.latitude - coord1.latitude);
  const dLon = deg2rad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(coord1.latitude)) *
      Math.cos(deg2rad(coord2.latitude)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  // Apply a correction factor for walking paths.
  return distanceKm * 1.3;
};