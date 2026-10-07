import React from 'react';
import { X, Sliders, Volume2, Globe, Clock, Shield, Check } from 'lucide-react';
import { AppSettings, NamingConvention, PrayerKey } from '../types/prayer';
import { CALCULATION_METHODS, NAMING_CONVENTIONS } from '../utils/prayerTimes';
import { playAdhanMotif, playChimeTone, playBeepTone } from '../utils/adhanAudio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleTestSound = (type: AppSettings['adhanSound']) => {
    if (type === 'adhan') playAdhanMotif();
    else if (type === 'chime') playChimeTone();
    else if (type === 'beep') playBeepTone();
  };

  const handleMinuteAdjustment = (key: PrayerKey, delta: number) => {
    const current = settings.minuteAdjustments[key] || 0;
    const updated = {
      ...settings.minuteAdjustments,
      [key]: current + delta,
    };
    onUpdateSettings({ minuteAdjustments: updated });
  };

  const currentNames = NAMING_CONVENTIONS[settings.namingConvention];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Prayer Settings</h2>
              <p className="text-xs text-slate-400">Customize naming, calculation method & alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Prayer Naming Convention */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Prayer Names Convention
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => onUpdateSettings({ namingConvention: 'regional1' })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.namingConvention === 'regional1'
                  ? 'bg-emerald-950/50 border-emerald-500/60 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Zuboh, Duhri, Asri, Magrib, Isha</span>
                {settings.namingConvention === 'regional1' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-emerald-400/90 mt-1">Requested regional format</p>
            </button>

            <button
              onClick={() => onUpdateSettings({ namingConvention: 'indonesia' })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.namingConvention === 'indonesia'
                  ? 'bg-emerald-950/50 border-emerald-500/60 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Subuh, Dzuhur, Ashar, Maghrib, Isya</span>
                {settings.namingConvention === 'indonesia' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">Standard Bahasa Indonesia</p>
            </button>

            <button
              onClick={() => onUpdateSettings({ namingConvention: 'malaysia' })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.namingConvention === 'malaysia'
                  ? 'bg-emerald-950/50 border-emerald-500/60 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Subuh, Zohor, Asar, Maghrib, Isyak</span>
                {settings.namingConvention === 'malaysia' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">Malaysia & Singapore standard</p>
            </button>

            <button
              onClick={() => onUpdateSettings({ namingConvention: 'standard' })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.namingConvention === 'standard'
                  ? 'bg-emerald-950/50 border-emerald-500/60 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Fajr, Dhuhr, Asr, Maghrib, Isha</span>
                {settings.namingConvention === 'standard' && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">International Arabic / English</p>
            </button>
          </div>
        </div>

        {/* Section 2: Calculation Method */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Astronomical Calculation Method
          </label>
          <select
            value={settings.calculationMethodId}
            onChange={(e) => onUpdateSettings({ calculationMethodId: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {Object.values(CALCULATION_METHODS).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.description})
              </option>
            ))}
          </select>
        </div>

        {/* Section 3: Juristic Method (Asr) & Time Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Asr Juristic Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ asrSchool: 'standard' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.asrSchool === 'standard'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Standard (Shafi'i)
              </button>
              <button
                onClick={() => onUpdateSettings({ asrSchool: 'hanafi' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.asrSchool === 'hanafi'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Hanafi (2x shadow)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Clock Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ timeFormat24h: false })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  !settings.timeFormat24h
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                12-Hour (AM/PM)
              </button>
              <button
                onClick={() => onUpdateSettings({ timeFormat24h: true })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.timeFormat24h
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                24-Hour (Military)
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Adhan Alert Tone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Adhan Alert Audio
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['adhan', 'chime', 'beep', 'silent'] as const).map((tone) => (
              <div key={tone} className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    onUpdateSettings({ adhanSound: tone });
                    handleTestSound(tone);
                  }}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${
                    settings.adhanSound === tone
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{tone === 'adhan' ? 'Adhan Melody' : tone}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Minute Adjustments */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Manual Minute Offsets (Local Mosque Sync)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((key) => {
              const offset = settings.minuteAdjustments[key] || 0;
              return (
                <div key={key} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[11px] font-bold text-slate-300 truncate">
                    {currentNames[key]}
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-400 my-1 tabular-nums">
                    {offset > 0 ? `+${offset}` : offset}m
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleMinuteAdjustment(key, -1)}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleMinuteAdjustment(key, 1)}
                      className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 6: Additional toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showImsak}
              onChange={(e) => onUpdateSettings({ showImsak: e.target.checked })}
              className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span>Show Imsak Card (Dawn pre-fast buffer)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showSunrise}
              onChange={(e) => onUpdateSettings({ showSunrise: e.target.checked })}
              className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span>Show Sunrise (Syuruq) Card</span>
          </label>
        </div>

        {/* Close CTA */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
