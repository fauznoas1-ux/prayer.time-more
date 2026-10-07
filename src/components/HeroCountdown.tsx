import React from 'react';
import { Volume2, Sparkles, Sun, Moon, Sunset, Sunrise, Clock } from 'lucide-react';
import { PrayerTimeItem, LocationData } from '../types/prayer';

interface HeroCountdownProps {
  currentTime: Date;
  currentPrayer: PrayerTimeItem | null;
  nextPrayer: PrayerTimeItem | null;
  timeRemaining: { hours: number; minutes: number; seconds: number; totalSeconds: number };
  progressPercent: number; // 0 to 100 within current prayer interval
  location: LocationData;
  onPlayAdhan: () => void;
  isPlayingAdhan: boolean;
  onStopAdhan: () => void;
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({
  currentTime,
  currentPrayer,
  nextPrayer,
  timeRemaining,
  progressPercent,
  location,
  onPlayAdhan,
  isPlayingAdhan,
  onStopAdhan,
}) => {
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Format time of next prayer
  const nextTimeFormatted = nextPrayer?.time || '--:--';

  // Format digital current clock
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const isPM = hours >= 12;
  const display12Hours = hours % 12 || 12;

  // Gregorian date formatted
  const gregorianDateStr = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-2xl p-6 sm:p-8 text-white">
      {/* Decorative celestial background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      {/* Subtle Islamic geometric star watermark motif */}
      <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Current Time & Location Status */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{location.city}, {location.country}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{gregorianDateStr}</span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
              Current Local Time
            </div>
            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                {pad(display12Hours)}:{pad(minutes)}
              </span>
              <span className="text-2xl sm:text-3xl text-emerald-400 font-light">
                :{pad(seconds)}
              </span>
              <span className="text-sm font-semibold tracking-wider text-slate-400">
                {isPM ? 'PM' : 'AM'}
              </span>
            </div>
          </div>

          {/* Current Active Prayer status */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {currentPrayer ? (
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <span className="text-xs text-slate-400">Current Prayer:</span>
                <span className="text-sm font-bold text-emerald-300">{currentPrayer.name}</span>
                <span className="font-amiri text-xs text-emerald-200/80">({currentPrayer.arabicName})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Waiting for dawn prayers</span>
              </div>
            )}

            {/* Test Adhan / Audio Preview Button */}
            {isPlayingAdhan ? (
              <button
                onClick={onStopAdhan}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-all cursor-pointer"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Stop Audio</span>
              </button>
            ) : (
              <button
                onClick={onPlayAdhan}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer"
                title="Preview soothing Adhan call synthesized melody"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Preview Adhan</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Next Prayer Highlight & Live Countdown Timer */}
        <div className="lg:col-span-6 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-800/90 p-5 sm:p-6 shadow-inner">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Prayer</span>
              <span className="text-slate-600">·</span>
              <span className="text-sm font-bold text-white">
                {nextPrayer ? nextPrayer.name : 'Zuboh'}
              </span>
              {nextPrayer && (
                <span className="font-amiri text-base text-emerald-400 leading-none">
                  {nextPrayer.arabicName}
                </span>
              )}
            </div>
            <div className="text-xs text-emerald-400 font-mono font-medium">
              at {nextTimeFormatted}
            </div>
          </div>

          {/* Countdown timer numbers */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center my-3">
            <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {pad(timeRemaining.hours)}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                Hours
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {pad(timeRemaining.minutes)}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                Minutes
              </div>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {pad(timeRemaining.seconds)}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                Seconds
              </div>
            </div>
          </div>

          {/* Visual Progress Bar to Next Prayer */}
          <div className="space-y-1.5 mt-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Time Elapsed in Interval</span>
              <span className="font-mono text-slate-300">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
