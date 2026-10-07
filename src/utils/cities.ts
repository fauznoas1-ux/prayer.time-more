import { LocationData } from '../types/prayer';

export const POPULAR_CITIES: LocationData[] = [
  // Southeast Asia
  { city: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 7, timezoneName: 'WIB (UTC+7)' },
  { city: 'Surabaya', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezone: 7, timezoneName: 'WIB (UTC+7)' },
  { city: 'Bandung', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191, timezone: 7, timezoneName: 'WIB (UTC+7)' },
  { city: 'Medan', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722, timezone: 7, timezoneName: 'WIB (UTC+7)' },
  { city: 'Makassar', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327, timezone: 8, timezoneName: 'WITA (UTC+8)' },
  { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 8, timezoneName: 'MYT (UTC+8)' },
  { city: 'Penang', country: 'Malaysia', latitude: 5.4141, longitude: 100.3288, timezone: 8, timezoneName: 'MYT (UTC+8)' },
  { city: 'Johor Bahru', country: 'Malaysia', latitude: 1.4927, longitude: 103.7414, timezone: 8, timezoneName: 'MYT (UTC+8)' },
  { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 8, timezoneName: 'SGT (UTC+8)' },
  { city: 'Bandar Seri Begawan', country: 'Brunei', latitude: 4.9031, longitude: 114.9398, timezone: 8, timezoneName: 'BNT (UTC+8)' },
  { city: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018, timezone: 7, timezoneName: 'ICT (UTC+7)' },

  // Middle East & Holy Cities
  { city: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, timezone: 3, timezoneName: 'AST (UTC+3)' },
  { city: 'Madinah', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692, timezone: 3, timezoneName: 'AST (UTC+3)' },
  { city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 3, timezoneName: 'AST (UTC+3)' },
  { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 4, timezoneName: 'GST (UTC+4)' },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773, timezone: 4, timezoneName: 'GST (UTC+4)' },
  { city: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, timezone: 3, timezoneName: 'AST (UTC+3)' },
  { city: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774, timezone: 3, timezoneName: 'AST (UTC+3)' },
  { city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 2, timezoneName: 'EET (UTC+2)' },
  { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 3, timezoneName: 'TRT (UTC+3)' },
  { city: 'Jerusalem (Al-Quds)', country: 'Palestine', latitude: 31.7683, longitude: 35.2137, timezone: 2, timezoneName: 'IST (UTC+2)' },

  // South & Central Asia
  { city: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 5, timezoneName: 'PKT (UTC+5)' },
  { city: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587, timezone: 5, timezoneName: 'PKT (UTC+5)' },
  { city: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, timezone: 6, timezoneName: 'BST (UTC+6)' },
  { city: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 5.5, timezoneName: 'IST (UTC+5:30)' },
  { city: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 5.5, timezoneName: 'IST (UTC+5:30)' },

  // Europe & Americas & Australia
  { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 0, timezoneName: 'GMT (UTC+0)' },
  { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 1, timezoneName: 'CET (UTC+1)' },
  { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, timezone: 1, timezoneName: 'CET (UTC+1)' },
  { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: -5, timezoneName: 'EST (UTC-5)' },
  { city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: -5, timezoneName: 'EST (UTC-5)' },
  { city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 10, timezoneName: 'AEST (UTC+10)' },
  { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 9, timezoneName: 'JST (UTC+9)' },
];

export const DEFAULT_LOCATION: LocationData = POPULAR_CITIES[0]; // Jakarta (Southeast Asia default matching "zuboh", "duhri", "asri", "magrib", "isha")
