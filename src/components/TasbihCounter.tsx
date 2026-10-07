import React, { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import { playTasbihClick } from '../utils/adhanAudio';

interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
}

const DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    translation: 'Glory be to Allah',
    target: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    target: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    target: 34,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    target: 100,
  },
  {
    id: 'tahlil',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illallah',
    translation: 'There is no god but Allah',
    target: 100,
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    transliteration: 'Allahumma Salli Ala Muhammad',
    translation: 'O Allah, send blessings upon Muhammad',
    target: 100,
  },
];

export const TasbihCounter: React.FC = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [laps, setLaps] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleIncrement = () => {
    if (soundEnabled) {
      playTasbihClick();
    }
    // Haptic feedback on mobile if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // Ignore
      }
    }

    const nextCount = count + 1;
    if (nextCount >= selectedDhikr.target) {
      setCount(0);
      setLaps((prev) => prev + 1);
      // Double haptic for completing round
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {
          // Ignore
        }
      }
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setLaps(0);
  };

  const progress = selectedDhikr.target > 0 ? (count / selectedDhikr.target) * 100 : 0;

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📿</span>
            <h2 className="text-xl font-bold text-white tracking-tight">Digital Tasbih Counter</h2>
            <span className="font-amiri text-emerald-400 text-lg">المسبحة</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Perform post-prayer dhikr (Subhanallah 33, Alhamdulillah 33, Allahu Akbar 34)
          </p>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Click Sound Enabled' : 'Click Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Preset Dhikr Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
        {DHIKR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedDhikr(preset);
              setCount(0);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap border ${
              selectedDhikr.id === preset.id
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <span>{preset.transliteration}</span>{' '}
            <span className="text-[10px] opacity-75">({preset.target})</span>
          </button>
        ))}
      </div>

      {/* Main Tasbih Tactile Button Container */}
      <div className="flex flex-col items-center justify-center py-4 space-y-6">
        {/* Arabic Text Display */}
        <div className="text-center space-y-1">
          <div className="font-amiri text-3xl sm:text-4xl text-emerald-300 leading-normal font-bold">
            {selectedDhikr.arabic}
          </div>
          <div className="text-base font-semibold text-white">
            {selectedDhikr.transliteration}
          </div>
          <div className="text-xs text-slate-400 italic">
            "{selectedDhikr.translation}"
          </div>
        </div>

        {/* Giant Circular Interactive Tap Counter Button */}
        <div className="relative">
          {/* Progress Ring SVG */}
          <svg className="w-64 h-64 -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="112"
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="112"
              className="stroke-emerald-400 transition-all duration-150 ease-out"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 112}
              strokeDashoffset={2 * Math.PI * 112 * (1 - progress / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Tap Target */}
          <button
            onClick={handleIncrement}
            className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-slate-700/80 shadow-2xl flex flex-col items-center justify-center text-center active:scale-95 transition-transform duration-100 cursor-pointer select-none group hover:border-emerald-500/50"
          >
            <span className="text-xs uppercase tracking-widest text-slate-400 font-medium group-hover:text-emerald-300 transition-colors">
              Tap Anywhere
            </span>
            <span className="text-5xl sm:text-6xl font-extrabold font-mono text-white tabular-nums my-1">
              {count}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              Target: {selectedDhikr.target}
            </span>
          </button>
        </div>

        {/* Laps / Rounds Counter */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <span>Completed Rounds:</span>
            <span className="font-bold font-mono text-emerald-400 text-sm">{laps}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <span>Total Recitations:</span>
            <span className="font-bold font-mono text-white text-sm">
              {laps * selectedDhikr.target + count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
