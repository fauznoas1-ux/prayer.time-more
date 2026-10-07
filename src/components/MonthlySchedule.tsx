import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Printer, Calendar, Download } from 'lucide-react';
import { LocationData, AppSettings } from '../types/prayer';
import { calculateRawTimes, decimalHoursToDate, formatTime, getHijriDate, NAMING_CONVENTIONS } from '../utils/prayerTimes';

interface MonthlyScheduleProps {
  location: LocationData;
  settings: AppSettings;
}

export const MonthlySchedule: React.FC<MonthlyScheduleProps> = ({ location, settings }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth(); // 0 to 11

  const names = NAMING_CONVENTIONS[settings.namingConvention];

  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate full month array
  const monthRows = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    const isToday =
      new Date().getDate() === day &&
      new Date().getMonth() === month &&
      new Date().getFullYear() === year;

    const raw = calculateRawTimes(
      date,
      location.latitude,
      location.longitude,
      location.timezone,
      settings.calculationMethodId,
      settings.asrSchool
    );

    const hijri = getHijriDate(date, settings.hijriDayAdjustment);

    return {
      day,
      date,
      dayName: date.toLocaleDateString(undefined, { weekday: 'short' }),
      hijriDay: hijri.day,
      hijriMonth: hijri.month,
      isToday,
      imsak: formatTime(decimalHoursToDate(date, raw.imsak, settings.minuteAdjustments.imsak), settings.timeFormat24h),
      fajr: formatTime(decimalHoursToDate(date, raw.fajr, settings.minuteAdjustments.fajr), settings.timeFormat24h),
      sunrise: formatTime(decimalHoursToDate(date, raw.sunrise, settings.minuteAdjustments.sunrise), settings.timeFormat24h),
      dhuhr: formatTime(decimalHoursToDate(date, raw.dhuhr, settings.minuteAdjustments.dhuhr), settings.timeFormat24h),
      asr: formatTime(decimalHoursToDate(date, raw.asr, settings.minuteAdjustments.asr), settings.timeFormat24h),
      maghrib: formatTime(decimalHoursToDate(date, raw.maghrib, settings.minuteAdjustments.maghrib), settings.timeFormat24h),
      isha: formatTime(decimalHoursToDate(date, raw.isha, settings.minuteAdjustments.isha), settings.timeFormat24h),
    };
  });

  const monthLabel = selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

  const handleTodayMonth = () => {
    setSelectedDate(new Date());
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
      {/* Top Header & Month Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Monthly Prayer Timetable</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete schedule for {location.city}, {location.country}
          </p>
        </div>

        {/* Month selector & actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/90 rounded-xl border border-slate-700/80 p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleTodayMonth}
              className="px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white whitespace-nowrap"
            >
              {monthLabel}
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Print Monthly Timetable"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/90 shadow-inner">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-3.5 text-center">Date</th>
              <th className="py-3 px-3 text-center">Hijri</th>
              {settings.showImsak && <th className="py-3 px-3 text-center text-indigo-400 font-bold">{names.imsak}</th>}
              <th className="py-3 px-3 text-center text-emerald-400 font-bold">{names.fajr}</th>
              {settings.showSunrise && <th className="py-3 px-3 text-center text-amber-400">{names.sunrise}</th>}
              <th className="py-3 px-3 text-center text-amber-300 font-bold">{names.dhuhr}</th>
              <th className="py-3 px-3 text-center text-orange-400 font-bold">{names.asr}</th>
              <th className="py-3 px-3 text-center text-rose-400 font-bold">{names.maghrib}</th>
              <th className="py-3 px-3 text-center text-cyan-400 font-bold">{names.isha}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
            {monthRows.map((row) => (
              <tr
                key={row.day}
                className={`transition-colors ${
                  row.isToday
                    ? 'bg-emerald-950/40 text-emerald-300 font-bold border-l-4 border-l-emerald-500'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <td className="py-2.5 px-3.5 text-center font-sans font-medium text-slate-200">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-5 text-right font-mono">{row.day}</span>
                    <span className="text-[11px] text-slate-500 uppercase">{row.dayName}</span>
                    {row.isToday && (
                      <span className="ml-1 text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-sans uppercase">
                        Today
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center text-slate-400 font-sans text-[11px]">
                  {row.hijriDay} {row.hijriMonth.slice(0, 3)}
                </td>
                {settings.showImsak && <td className="py-2.5 px-3 text-center">{row.imsak}</td>}
                <td className="py-2.5 px-3 text-center text-emerald-300 font-semibold">{row.fajr}</td>
                {settings.showSunrise && <td className="py-2.5 px-3 text-center text-slate-400">{row.sunrise}</td>}
                <td className="py-2.5 px-3 text-center font-semibold">{row.dhuhr}</td>
                <td className="py-2.5 px-3 text-center font-semibold">{row.asr}</td>
                <td className="py-2.5 px-3 text-center text-rose-300 font-semibold">{row.maghrib}</td>
                <td className="py-2.5 px-3 text-center text-cyan-300 font-semibold">{row.isha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
