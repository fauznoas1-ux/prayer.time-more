export type PrayerKey = 'imsak' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'sunset' | 'maghrib' | 'isha';

export type NamingConvention = 'regional1' | 'indonesia' | 'malaysia' | 'standard';

export interface PrayerNameMap {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset?: string;
  maghrib: string;
  isha: string;
  imsak: string;
}

export interface CalculationMethod {
  id: string;
  name: string;
  description: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaInterval?: number; // Minutes after maghrib if fixed
}

export interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours, e.g. +7 or +8
  timezoneName?: string;
  isCustom?: boolean;
}

export interface PrayerTimeItem {
  key: PrayerKey;
  name: string;
  arabicName: string;
  time: string; // e.g. "04:42" (24h) or "04:42 AM"
  timestamp: Date;
  isPast: boolean;
  isCurrent: boolean;
  isNext: boolean;
  iconName: string;
  completed?: boolean;
}

export interface AppSettings {
  namingConvention: NamingConvention;
  calculationMethodId: string;
  asrSchool: 'standard' | 'hanafi'; // 1x vs 2x shadow
  timeFormat24h: boolean;
  showImsak: boolean;
  showSunrise: boolean;
  adhanSound: 'adhan' | 'chime' | 'beep' | 'silent';
  prayerAlerts: Record<PrayerKey, boolean>;
  minuteAdjustments: Record<PrayerKey, number>;
  hijriDayAdjustment: number;
}
