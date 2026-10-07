export const KAABA_LAT = 21.422487;
export const KAABA_LON = 39.826206;

const degToRad = (deg: number) => (deg * Math.PI) / 180.0;
const radToDeg = (rad: number) => (rad * 180.0) / Math.PI;

/**
 * Calculates the Qibla bearing in degrees from True North (0° = North, 90° = East)
 */
export function calculateQiblaDirection(latitude: number, longitude: number): number {
  const phi1 = degToRad(latitude);
  const phi2 = degToRad(KAABA_LAT);
  const deltaLambda = degToRad(KAABA_LON - longitude);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qibla = radToDeg(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

/**
 * Great circle distance to Makkah in kilometers
 */
export function calculateDistanceToKaabaKm(latitude: number, longitude: number): number {
  const R = 6371; // Earth radius in km
  const dLat = degToRad(KAABA_LAT - latitude);
  const dLon = degToRad(KAABA_LON - longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(latitude)) * Math.cos(degToRad(KAABA_LAT)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function getCompassHeadingName(degrees: number): string {
  const deg = (degrees + 360) % 360;
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}
