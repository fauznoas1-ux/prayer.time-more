import React, { useState } from 'react';
import { X, Search, MapPin, Navigation, Compass, Globe } from 'lucide-react';
import { LocationData } from '../types/prayer';
import { POPULAR_CITIES } from '../utils/cities';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Custom coordinate input state
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [customTz, setCustomTz] = useState(String(-new Date().getTimezoneOffset() / 60));

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // Infer timezone offset from device
        const tz = -new Date().getTimezoneOffset() / 60;

        const gpsLoc: LocationData = {
          city: 'My Location',
          country: 'GPS Position',
          latitude: Number(lat.toFixed(4)),
          longitude: Number(lon.toFixed(4)),
          timezone: tz,
          timezoneName: `Local (UTC${tz >= 0 ? '+' : ''}${tz})`,
          isCustom: true,
        };

        onSelectLocation(gpsLoc);
        onClose();
      },
      (err) => {
        setIsLocating(false);
        setGeoError(`Location access error: ${err.message}. Please select a city from the list.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    const tz = parseFloat(customTz);

    if (isNaN(lat) || isNaN(lon) || isNaN(tz)) {
      setGeoError('Please enter valid numeric latitude, longitude, and timezone offset.');
      return;
    }

    const customLoc: LocationData = {
      city: customCity.trim() || 'Custom Coordinates',
      country: 'User Defined',
      latitude: lat,
      longitude: lon,
      timezone: tz,
      timezoneName: `UTC${tz >= 0 ? '+' : ''}${tz}`,
      isCustom: true,
    };

    onSelectLocation(customLoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Select Location</h2>
              <p className="text-xs text-slate-400">Calculate exact prayer times and Qibla angle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Action */}
        <div>
          <button
            onClick={handleUseGPS}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-60 cursor-pointer"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting GPS Coordinates...' : 'Use My Current GPS Location'}</span>
          </button>
          {geoError && (
            <p className="text-xs text-rose-400 mt-2 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {geoError}
            </p>
          )}
        </div>

        {/* Tab switch: Search Cities vs Custom Coordinates */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !isCustomMode
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Popular Cities
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isCustomMode
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Lat / Long
          </button>
        </div>

        {!isCustomMode ? (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city or country (e.g. Jakarta, Kuala Lumpur, Mecca)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* City list */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/40">
              {filteredCities.map((city) => {
                const isSelected =
                  currentLocation.city === city.city && currentLocation.country === city.country;

                return (
                  <button
                    key={`${city.city}-${city.country}`}
                    onClick={() => {
                      onSelectLocation(city);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border border-emerald-500/50 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <span>{city.city}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {city.country} · {city.timezoneName}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 font-mono tabular-nums">
                      {city.latitude > 0 ? `${city.latitude}°N` : `${Math.abs(city.latitude)}°S`},{' '}
                      {city.longitude > 0 ? `${city.longitude}°E` : `${Math.abs(city.longitude)}°W`}
                    </div>
                  </button>
                );
              })}
              {filteredCities.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-500">
                  No cities found matching "{searchTerm}". Try entering custom coordinates.
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveCustom} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Location Name / City
              </label>
              <input
                type="text"
                placeholder="e.g. My Town"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Latitude (-90 to 90)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. -6.2088"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Longitude (-180 to 180)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 106.8456"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Timezone UTC Offset (hours, e.g. 7 for WIB, 8 for MYT/SGT, 3 for Makkah)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 7"
                value={customTz}
                onChange={(e) => setCustomTz(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Apply Custom Coordinates
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
