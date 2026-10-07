import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LocationData, AppSettings, PrayerKey, PrayerTimeItem } from './types/prayer';
import { DEFAULT_LOCATION } from './utils/cities';
import {
  calculateRawTimes,
  decimalHoursToDate,
  formatTime,
  getHijriDate,
  NAMING_CONVENTIONS,
  ARABIC_NAMES,
} from './utils/prayerTimes';
import { playAdhanMotif, playChimeTone, playBeepTone } from './utils/adhanAudio';
import { Header } from './components/Header';
import { HeroCountdown } from './components/HeroCountdown';
import { PrayerCards } from './components/PrayerCards';
import { QiblaCompass } from './components/QiblaCompass';
import { MonthlySchedule } from './components/MonthlySchedule';
import { TasbihCounter } from './components/TasbihCounter';
import { DuaModal } from './components/DuaModal';
import { SettingsModal } from './components/SettingsModal';
import { LocationModal } from './components/LocationModal';

const DEFAULT_SETTINGS: AppSettings = {
  namingConvention: 'regional1', // "Zuboh, Duhri, Asri, Magrib, Isha" requested by user!
  calculationMethodId: 'kemenag',
  asrSchool: 'standard',
  timeFormat24h: false,
  showImsak: true,
  showSunrise: true,
  adhanSound: 'adhan',
  prayerAlerts: {
    imsak: false,
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    sunset: false,
    maghrib: true,
    isha: true,
  },
  minuteAdjustments: {
    imsak: 0,
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    sunset: 0,
    maghrib: 0,
    isha: 0,
  },
  hijriDayAdjustment: 0,
};

export default function App() {
  // State: Current Location
  const [location, setLocation] = useState<LocationData>(() => {
    try {
      const saved = localStorage.getItem('nursalat_location');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_LOCATION;
  });

  // State: App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('nursalat_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // State: Active tab
  const [activeTab, setActiveTab] = useState<'today' | 'qibla' | 'calendar' | 'tasbih' | 'duas'>('today');

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDuaModalOpen, setIsDuaModalOpen] = useState(false);

  // Audio playback state
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);

  // Real-time ticking clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Completed prayers tracker for today (keyed by date string YYYY-MM-DD)
  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);

  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`nursalat_completed_${todayKey}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {};
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nursalat_location', JSON.stringify(location));
    } catch {
      // Ignore
    }
  }, [location]);

  useEffect(() => {
    try {
      localStorage.setItem('nursalat_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(`nursalat_completed_${todayKey}`, JSON.stringify(completedPrayers));
    } catch {
      // Ignore
    }
  }, [completedPrayers, todayKey]);

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track prayer times calculation
  const names = NAMING_CONVENTIONS[settings.namingConvention] || NAMING_CONVENTIONS.regional1;

  // Calculate today's prayer times
  const todayTimes: PrayerTimeItem[] = useMemo(() => {
    const raw = calculateRawTimes(
      currentTime,
      location.latitude,
      location.longitude,
      location.timezone,
      settings.calculationMethodId,
      settings.asrSchool
    );

    const orderedKeys: PrayerKey[] = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

    return orderedKeys.map((key) => {
      const rawHour = raw[key];
      const offset = settings.minuteAdjustments[key] || 0;
      const date = decimalHoursToDate(currentTime, rawHour, offset);
      const displayName = names[key as keyof typeof names] || key;
      return {
        key,
        name: displayName,
        arabicName: ARABIC_NAMES[key] || '',
        time: formatTime(date, settings.timeFormat24h),
        timestamp: date,
        isPast: currentTime.getTime() > date.getTime(),
        isCurrent: false,
        isNext: false,
        iconName: String(key),
      };
    });
  }, [currentTime, location, settings, names]);

  // Calculate tomorrow's times (needed for countdown if after Isha)
  const tomorrowTimes: PrayerTimeItem[] = useMemo(() => {
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const raw = calculateRawTimes(
      tomorrow,
      location.latitude,
      location.longitude,
      location.timezone,
      settings.calculationMethodId,
      settings.asrSchool
    );

    const orderedKeys: PrayerKey[] = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

    return orderedKeys.map((key) => {
      const rawHour = raw[key];
      const offset = settings.minuteAdjustments[key] || 0;
      const date = decimalHoursToDate(tomorrow, rawHour, offset);
      const displayName = names[key as keyof typeof names] || key;
      return {
        key,
        name: displayName,
        arabicName: ARABIC_NAMES[key] || '',
        time: formatTime(date, settings.timeFormat24h),
        timestamp: date,
        isPast: false,
        isCurrent: false,
        isNext: false,
        iconName: String(key),
      };
    });
  }, [currentTime, location, settings, names]);

  // Determine current prayer, next prayer, and countdown
  const { annotatedPrayers, currentPrayer, nextPrayer, timeRemaining, progressPercent } = useMemo(() => {
    const nowMs = currentTime.getTime();

    // Obligatory or standard sequence for window calculation
    const sequence: PrayerTimeItem[] = todayTimes.filter((p) => {
      // We evaluate prayer windows along Fajr -> Sunrise -> Dhuhr -> Asr -> Maghrib -> Isha
      return p.key !== 'imsak';
    });

    let currentItem: PrayerTimeItem | null = null;
    let nextItemFound: PrayerTimeItem | null = null;
    let prevWindowTime = sequence.length > 0 ? sequence[0].timestamp.getTime() : nowMs;
    let nextWindowTime = sequence.length > 0 ? sequence[0].timestamp.getTime() : nowMs;

    // Check where nowMs falls
    for (let i = 0; i < sequence.length; i++) {
      const item = sequence[i];
      const nextItem = sequence[i + 1];

      if (nowMs >= item.timestamp.getTime()) {
        if (!nextItem || nowMs < nextItem.timestamp.getTime()) {
          currentItem = item;
          if (nextItem) {
            nextItemFound = nextItem;
            prevWindowTime = item.timestamp.getTime();
            nextWindowTime = nextItem.timestamp.getTime();
          } else {
            // After Isha -> next is tomorrow's Fajr/Zuboh
            const tomorrowFajr = tomorrowTimes.find((p) => p.key === 'fajr') || tomorrowTimes[1];
            nextItemFound = tomorrowFajr;
            prevWindowTime = item.timestamp.getTime();
            nextWindowTime = tomorrowFajr.timestamp.getTime();
          }
        }
      }
    }

    // Before today's Fajr (midnight to dawn)
    if (!currentItem && sequence.length > 0) {
      nextItemFound = sequence[0]; // Fajr
      // Prior window was yesterday's Isha
      const yesterdayIsha = new Date(sequence[sequence.length - 1].timestamp);
      yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
      prevWindowTime = yesterdayIsha.getTime();
      nextWindowTime = sequence[0].timestamp.getTime();
    }

    // Calculate countdown
    const targetNextMs = nextItemFound ? nextItemFound.timestamp.getTime() : nowMs;
    const diffSec = Math.max(0, Math.floor((targetNextMs - nowMs) / 1000));
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    // Window progress percentage
    const windowSpan = nextWindowTime - prevWindowTime;
    const elapsed = nowMs - prevWindowTime;
    const pct = windowSpan > 0 ? Math.min(100, Math.max(0, (elapsed / windowSpan) * 100)) : 0;

    // Annotate prayers with flags
    const annotated: PrayerTimeItem[] = todayTimes.map((p) => ({
      ...p,
      isCurrent: currentItem ? currentItem.key === p.key : false,
      isNext: nextItemFound ? nextItemFound.key === p.key : false,
    }));

    return {
      annotatedPrayers: annotated,
      currentPrayer: currentItem,
      nextPrayer: nextItemFound,
      timeRemaining: { hours, minutes, seconds, totalSeconds: diffSec },
      progressPercent: pct,
    };
  }, [currentTime, todayTimes, tomorrowTimes]);

  // Handle adhan sound alert when prayer time exactly hits
  const lastAlertedRef = useRef<string>('');
  useEffect(() => {
    if (settings.adhanSound === 'silent') return;

    todayTimes.forEach((prayer) => {
      // Check if alert is enabled for this prayer
      if (!settings.prayerAlerts[prayer.key]) return;

      const pTime = prayer.timestamp;
      const isSameMinute =
        currentTime.getHours() === pTime.getHours() &&
        currentTime.getMinutes() === pTime.getMinutes() &&
        currentTime.getSeconds() <= 2;

      const alertKey = `${todayKey}_${prayer.key}_${pTime.getHours()}_${pTime.getMinutes()}`;
      if (isSameMinute && lastAlertedRef.current !== alertKey) {
        lastAlertedRef.current = alertKey;
        if (settings.adhanSound === 'adhan') {
          setIsPlayingAdhan(true);
          playAdhanMotif(() => setIsPlayingAdhan(false));
        } else if (settings.adhanSound === 'chime') {
          playChimeTone();
        } else if (settings.adhanSound === 'beep') {
          playBeepTone();
        }
      }
    });
  }, [currentTime, todayTimes, settings, todayKey]);

  // Audio Playback triggers
  const handlePlayAdhanPreview = () => {
    setIsPlayingAdhan(true);
    playAdhanMotif(() => setIsPlayingAdhan(false));
  };

  const handleStopAdhanPreview = () => {
    setIsPlayingAdhan(false);
  };

  // Toggle daily prayer completed checkbox
  const handleToggleCompleted = (key: PrayerKey) => {
    setCompletedPrayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle individual prayer alert
  const handleTogglePrayerAlert = (key: PrayerKey) => {
    const updated = {
      ...settings.prayerAlerts,
      [key]: !settings.prayerAlerts[key],
    };
    setSettings((prev) => ({ ...prev, prayerAlerts: updated }));
  };

  // Hijri date string
  const hijri = getHijriDate(currentTime, settings.hijriDayAdjustment);
  const hijriDateStr = `${hijri.day} ${hijri.month} ${hijri.year} AH`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        location={location}
        settings={settings}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'duas') {
            setIsDuaModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenDuas={() => setIsDuaModalOpen(true)}
        onToggleSound={() => {
          setSettings((prev) => ({
            ...prev,
            adhanSound: prev.adhanSound === 'silent' ? 'adhan' : 'silent',
          }));
        }}
        hijriDateStr={hijriDateStr}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Active Tab View Rendering */}
        {activeTab === 'today' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Countdown with next prayer & live clock */}
            <HeroCountdown
              currentTime={currentTime}
              currentPrayer={currentPrayer}
              nextPrayer={nextPrayer}
              timeRemaining={timeRemaining}
              progressPercent={progressPercent}
              location={location}
              onPlayAdhan={handlePlayAdhanPreview}
              isPlayingAdhan={isPlayingAdhan}
              onStopAdhan={handleStopAdhanPreview}
            />

            {/* Core 5 Prayers: Zuboh, Duhri, Asri, Magrib, Isha */}
            <PrayerCards
              prayers={annotatedPrayers}
              completedPrayers={completedPrayers}
              onToggleCompleted={handleToggleCompleted}
              settings={settings}
              onTogglePrayerAlert={handleTogglePrayerAlert}
            />

            {/* Quick Feature Companion Cards (Qibla & Tasbih Shortcuts) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab('qibla')}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="font-amiri text-lg">🕋</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Qibla Compass
                    </h3>
                    <p className="text-xs text-slate-400">
                      Find exact direction to Makkah from {location.city}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400">Open Compass →</span>
              </div>

              <div
                onClick={() => setActiveTab('tasbih')}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-lg">📿</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                      Digital Tasbih & Dhikr
                    </h3>
                    <p className="text-xs text-slate-400">
                      Subhanallah (33), Alhamdulillah (33), Allahu Akbar (34)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-teal-400">Start Dhikr →</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qibla' && (
          <div className="animate-in fade-in duration-300">
            <QiblaCompass location={location} />
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="animate-in fade-in duration-300">
            <MonthlySchedule location={location} settings={settings} />
          </div>
        )}

        {activeTab === 'tasbih' && (
          <div className="animate-in fade-in duration-300">
            <TasbihCounter />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-4 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Nur Salat</span>
            <span>·</span>
            <span>Zuboh, Duhri, Asri, Magrib, Isha</span>
          </div>
          <div>
            <span>Accurate astronomical calculations · Solar declination model</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={(loc) => setLocation(loc)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
      />

      <DuaModal
        isOpen={isDuaModalOpen}
        onClose={() => setIsDuaModalOpen(false)}
      />
    </div>
  );
}
