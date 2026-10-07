import { CalculationMethod, NamingConvention, PrayerKey, PrayerNameMap } from '../types/prayer';

export const CALCULATION_METHODS: Record<string, CalculationMethod> = {
  kemenag: {
    id: 'kemenag',
    name: 'Kemenag RI (Southeast Asia)',
    description: 'Ministry of Religious Affairs Indonesia / Malaysia / Singapore standard',
    fajrAngle: 20,
    ishaAngle: 18,
  },
  mwl: {
    id: 'mwl',
    name: 'Muslim World League (MWL)',
    description: 'Standard across Europe, Far East, and parts of the Americas',
    fajrAngle: 18,
    ishaAngle: 17,
  },
  egypt: {
    id: 'egypt',
    name: 'Egyptian General Authority of Survey',
    description: 'Africa, Syria, Iraq, Lebanon, and Malaysia',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
  },
  makkah: {
    id: 'makkah',
    name: 'Umm Al-Qura University, Makkah',
    description: 'Arabian Peninsula standard (Fajr 18.5°, Isha 90 min after Maghrib)',
    fajrAngle: 18.5,
    ishaAngle: 18.5,
    ishaInterval: 90,
  },
  isna: {
    id: 'isna',
    name: 'Islamic Society of North America (ISNA)',
    description: 'North America (USA & Canada)',
    fajrAngle: 15,
    ishaAngle: 15,
  },
  karachi: {
    id: 'karachi',
    name: 'University of Islamic Sciences, Karachi',
    description: 'Pakistan, India, Bangladesh, and Afghanistan',
    fajrAngle: 18,
    ishaAngle: 18,
  },
};

export const NAMING_CONVENTIONS: Record<NamingConvention, PrayerNameMap> = {
  regional1: {
    imsak: 'Imsak',
    fajr: 'Zuboh',
    sunrise: 'Syuruq',
    dhuhr: 'Duhri',
    asr: 'Asri',
    maghrib: 'Magrib',
    isha: 'Isha',
  },
  indonesia: {
    imsak: 'Imsak',
    fajr: 'Subuh',
    sunrise: 'Terbit',
    dhuhr: 'Dzuhur',
    asr: 'Ashar',
    maghrib: 'Maghrib',
    isha: 'Isya',
  },
  malaysia: {
    imsak: 'Imsak',
    fajr: 'Subuh',
    sunrise: 'Syuruk',
    dhuhr: 'Zohor',
    asr: 'Asar',
    maghrib: 'Maghrib',
    isha: 'Isyak',
  },
  standard: {
    imsak: 'Imsak',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  },
};

export const ARABIC_NAMES: Record<PrayerKey, string> = {
  imsak: 'الإمساك',
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  sunset: 'الغروب',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

// Math helpers for astronomical calculations
const degToRad = (deg: number) => (deg * Math.PI) / 180.0;
const radToDeg = (rad: number) => (rad * 180.0) / Math.PI;

const fixAngle = (a: number) => {
  let res = a - 360.0 * Math.floor(a / 360.0);
  return res < 0 ? res + 360.0 : res;
};

const fixHour = (h: number) => {
  let res = h - 24.0 * Math.floor(h / 24.0);
  return res < 0 ? res + 24.0 : res;
};

/**
 * Astronomical calculation of Sun coordinates
 */
function sunPosition(julianDate: number) {
  const D = julianDate - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));

  const e = 23.439 - 0.00000036 * D;
  const RA = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L)))) / 15.0;
  const declination = radToDeg(Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(L))));
  const equationOfTime = q / 15.0 - fixHour(RA);

  return { declination, equationOfTime };
}

function julianDay(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/**
 * Mid-day time (Dhuhr)
 */
function computeMidDay(timeZone: number, longitude: number, eqTime: number) {
  return fixHour(12 + timeZone - longitude / 15.0 - eqTime);
}

/**
 * Sun angle time for Fajr, Sunrise, Sunset, Isha
 */
function computeAngleTime(angle: number, midDay: number, latitude: number, declination: number, direction: 'ccw' | 'cw') {
  const latR = degToRad(latitude);
  const decR = degToRad(declination);
  const angleR = degToRad(angle);

  const val = (-Math.sin(angleR) - Math.sin(latR) * Math.sin(decR)) / (Math.cos(latR) * Math.cos(decR));
  if (val > 1 || val < -1) {
    return null; // Extreme latitude, no twilight
  }

  const hourAngle = radToDeg(Math.acos(val)) / 15.0;
  return midDay + (direction === 'ccw' ? -hourAngle : hourAngle);
}

/**
 * Asr time calculation based on shadow ratio
 * t = 1 for Standard (Shafi'i, Maliki, Hanbali), t = 2 for Hanafi
 */
function computeAsrTime(t: number, midDay: number, latitude: number, declination: number) {
  const latR = degToRad(latitude);
  const decR = degToRad(declination);
  const diff = Math.abs(latR - decR);
  const angle = -radToDeg(Math.atan(1.0 / (t + Math.tan(diff))));

  return computeAngleTime(angle, midDay, latitude, declination, 'cw');
}

export interface RawPrayerTimes {
  imsak: number;
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  sunset: number;
  maghrib: number;
  isha: number;
}

export function calculateRawTimes(
  date: Date,
  latitude: number,
  longitude: number,
  timeZone: number,
  methodId: string = 'kemenag',
  asrSchool: 'standard' | 'hanafi' = 'standard'
): RawPrayerTimes {
  const method = CALCULATION_METHODS[methodId] || CALCULATION_METHODS.kemenag;
  const JD = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const { declination, equationOfTime } = sunPosition(JD);

  const midDay = computeMidDay(timeZone, longitude, equationOfTime);
  const dhuhr = midDay + 0.02; // +1.2 minute safety buffer after solar meridian

  // Sunrise and Sunset: center of sun reaches -0.833°
  const sunrise = computeAngleTime(0.833, midDay, latitude, declination, 'ccw') ?? midDay - 6;
  const sunset = computeAngleTime(0.833, midDay, latitude, declination, 'cw') ?? midDay + 6;

  // Fajr
  const fajr = computeAngleTime(method.fajrAngle, midDay, latitude, declination, 'ccw') ?? midDay - 7;

  // Asr
  const asrFactor = asrSchool === 'hanafi' ? 2 : 1;
  const asr = computeAsrTime(asrFactor, midDay, latitude, declination) ?? midDay + 3.5;

  // Maghrib
  const maghrib = sunset + 0.03; // Maghrib starts shortly after sunset begins

  // Isha
  let isha = 0;
  if (method.ishaInterval) {
    isha = maghrib + method.ishaInterval / 60.0;
  } else {
    isha = computeAngleTime(method.ishaAngle, midDay, latitude, declination, 'cw') ?? maghrib + 1.5;
  }

  // Imsak: 10 minutes before Fajr
  const imsak = fajr - 10 / 60.0;

  return {
    imsak: fixHour(imsak),
    fajr: fixHour(fajr),
    sunrise: fixHour(sunrise),
    dhuhr: fixHour(dhuhr),
    asr: fixHour(asr),
    sunset: fixHour(sunset),
    maghrib: fixHour(maghrib),
    isha: fixHour(isha),
  };
}

/**
 * Converts decimal hours to a JavaScript Date object on the specified target date
 */
export function decimalHoursToDate(baseDate: Date, decimalHours: number, minuteAdjustment: number = 0): Date {
  const date = new Date(baseDate);
  const totalMinutes = Math.round(decimalHours * 60) + minuteAdjustment;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatTime(date: Date, is24h: boolean): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (is24h) {
    return `${pad(hours)}:${pad(minutes)}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${pad(displayHours)}:${pad(minutes)} ${period}`;
}

/**
 * Algorithmic Hijri Date estimation (Kuwaiti / Umm al-Qura standard astronomical model)
 */
export function getHijriDate(date: Date, adjustmentDays: number = 0): { day: number; month: string; monthNumber: number; year: number } {
  const adjDate = new Date(date);
  adjDate.setDate(adjDate.getDate() + adjustmentDays);

  const jd = julianDay(adjDate.getFullYear(), adjDate.getMonth() + 1, adjDate.getDate());
  let l = Math.floor(jd) - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l) / 709);
  const d = l - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  const hijriMonths = [
    'Muharram',
    'Safar',
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhu al-Qi'dah",
    'Dhu al-Hijjah',
  ];

  const monthIdx = Math.max(0, Math.min(11, m - 1));

  return {
    day: d,
    month: hijriMonths[monthIdx],
    monthNumber: m,
    year: y,
  };
}
