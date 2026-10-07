import React from 'react';
import { MapPin, Settings as SettingsIcon, Volume2, VolumeX, Moon, BookOpen, Compass, Calendar, CheckSquare } from 'lucide-react';
import { LocationData, AppSettings } from '../types/prayer';

interface HeaderProps {
  location: LocationData;
  settings: AppSettings;
  activeTab: 'today' | 'qibla' | 'calendar' | 'tasbih' | 'duas';
  setActiveTab: (tab: 'today' | 'qibla' | 'calendar' | 'tasbih' | 'duas') => void;
  onOpenLocation: () => void;
  onOpenSettings: () => void;
  onOpenDuas: () => void;
  onToggleSound: () => void;
  hijriDateStr: string;
}

export const Header: React.FC<HeaderProps> = ({
  location,
  settings,
  activeTab,
  setActiveTab,
  onOpenLocation,
  onOpenSettings,
  onOpenDuas,
  onToggleSound,
  hijriDateStr,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Brand Identity and Hijri Date */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/20">
              <Moon className="w-5 h-5 text-emerald-50 fill-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Nur Salat</span>
                <span className="text-xs text-emerald-400 font-medium font-amiri text-[13px] pt-0.5">نور الصلاة</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>{hijriDateStr}</span>
              </div>
            </div>
          </div>

          {/* Mobile Right Quick Action: Location Trigger */}
          <button
            onClick={onOpenLocation}
            className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[90px] truncate">{location.city}</span>
          </button>
        </div>

        {/* Center: Navigation Navigation Buttons */}
        <nav className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'today'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Prayers</span>
          </button>

          <button
            onClick={() => setActiveTab('qibla')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'qibla'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Qibla</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Monthly</span>
          </button>

          <button
            onClick={() => setActiveTab('tasbih')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'tasbih'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="font-amiri text-sm leading-none">📿</span>
            <span>Tasbih</span>
          </button>

          <button
            onClick={onOpenDuas}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Du'a</span>
          </button>
        </nav>

        {/* Right: Location, Sound & Settings Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Change Location"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{location.city}, {location.country}</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              settings.adhanSound !== 'silent'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={settings.adhanSound !== 'silent' ? `Alerts Sound: ${settings.adhanSound}` : 'Sound Muted'}
          >
            {settings.adhanSound !== 'silent' ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            title="Prayer Settings & Methods"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
