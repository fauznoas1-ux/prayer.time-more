import React from 'react';
import { Check, Bell, BellOff, Sun, Moon, Sunset, Sunrise, Clock, Sparkles } from 'lucide-react';
import { PrayerTimeItem, PrayerKey, AppSettings } from '../types/prayer';

interface PrayerCardsProps {
  prayers: PrayerTimeItem[];
  completedPrayers: Record<string, boolean>;
  onToggleCompleted: (key: PrayerKey) => void;
  settings: AppSettings;
  onTogglePrayerAlert: (key: PrayerKey) => void;
}

export const PrayerCards: React.FC<PrayerCardsProps> = ({
  prayers,
  completedPrayers,
  onToggleCompleted,
  settings,
  onTogglePrayerAlert,
}) => {
  // Filter core vs secondary prayers based on user settings
  const filteredPrayers = prayers.filter((p) => {
    if (p.key === 'imsak' && !settings.showImsak) return false;
    if (p.key === 'sunrise' && !settings.showSunrise) return false;
    return true;
  });

  const obligatoryKeys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const completedCount = obligatoryKeys.filter((k) => completedPrayers[k]).length;
  const isAllCompleted = completedCount === obligatoryKeys.length;

  const getPrayerIcon = (key: PrayerKey) => {
    switch (key) {
      case 'imsak':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'fajr':
        return <Sunrise className="w-5 h-5 text-emerald-400" />;
      case 'sunrise':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'asr':
        return <Sun className="w-5 h-5 text-orange-400" />;
      case 'sunset':
      case 'maghrib':
        return <Sunset className="w-5 h-5 text-rose-400" />;
      case 'isha':
        return <Moon className="w-5 h-5 text-cyan-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header with Daily Salat Tracker summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Today's Prayer Schedule</span>
            {isAllCompleted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                <span>Alhamdulillah · All Completed</span>
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">
            Zuboh, Duhri, Asri, Magrib & Isha with daily prayer verification
          </p>
        </div>

        {/* Daily Prayer completion tracker bar */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="text-xs text-slate-300">
            Completed: <span className="font-semibold text-emerald-400 font-mono">{completedCount}/5</span>
          </div>
          <div className="flex items-center gap-1">
            {obligatoryKeys.map((key) => (
              <div
                key={key}
                className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                  completedPrayers[key]
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/40'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
                title={`Status for ${key}`}
              >
                {completedPrayers[key] && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Prayer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {filteredPrayers.map((prayer) => {
          const isCompleted = !!completedPrayers[prayer.key];
          const isAlertEnabled = settings.prayerAlerts[prayer.key] ?? true;
          const isCoreObligatory = obligatoryKeys.includes(prayer.key);

          // Card visual state
          let cardBorder = 'border-slate-800/80 hover:border-slate-700';
          let cardBg = 'bg-slate-900/60';
          let ringEffect = '';

          if (prayer.isCurrent) {
            cardBorder = 'border-emerald-500/60';
            cardBg = 'bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-900';
            ringEffect = 'ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-950/50';
          } else if (prayer.isNext) {
            cardBorder = 'border-teal-500/50';
            cardBg = 'bg-gradient-to-b from-teal-950/30 to-slate-900/80';
            ringEffect = 'ring-1 ring-teal-500/30';
          }

          return (
            <div
              key={prayer.key}
              className={`relative rounded-2xl border ${cardBorder} ${cardBg} ${ringEffect} p-4 transition-all duration-200 flex flex-col justify-between group`}
            >
              {/* Top Row: Icon, Status Tag, and Arabic script */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
                  {getPrayerIcon(prayer.key)}
                </div>

                <div className="text-right">
                  <div className="font-amiri text-lg text-emerald-300 leading-tight">
                    {prayer.arabicName}
                  </div>
                  {prayer.isCurrent && (
                    <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 mt-0.5">
                      Now Active
                    </span>
                  )}
                  {prayer.isNext && (
                    <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded-md border border-teal-500/30 mt-0.5">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>

              {/* Middle: Prayer Name & Large Formatted Time */}
              <div className="my-2">
                <div className="text-xs text-slate-400 font-medium">
                  {prayer.key === 'sunrise' || prayer.key === 'imsak' ? 'Sun Phase' : 'Salat Time'}
                </div>
                <div className="text-lg font-bold text-white tracking-tight">
                  {prayer.name}
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight mt-1 tabular-nums">
                  {prayer.time}
                </div>
              </div>

              {/* Bottom: Action Controls (Alert Toggle & Mark Done) */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                {/* Alert toggle button */}
                <button
                  onClick={() => onTogglePrayerAlert(prayer.key)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    isAlertEnabled
                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                      : 'text-slate-500 hover:bg-slate-800 hover:text-slate-400'
                  }`}
                  title={isAlertEnabled ? `Adhan alert ON for ${prayer.name}` : `Adhan alert OFF for ${prayer.name}`}
                >
                  {isAlertEnabled ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>

                {/* Mark as Prayed Checkbox (only for obligatory prayers) */}
                {isCoreObligatory ? (
                  <button
                    onClick={() => onToggleCompleted(prayer.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{isCompleted ? 'Done' : 'Mark'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Optional</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
