import React, { useState, useEffect } from 'react';
import { Compass as CompassIcon, RotateCw, MapPin, Navigation, Info, ShieldCheck } from 'lucide-react';
import { LocationData } from '../types/prayer';
import { calculateQiblaDirection, calculateDistanceToKaabaKm, getCompassHeadingName } from '../utils/qibla';

interface QiblaCompassProps {
  location: LocationData;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ location }) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [manualRotation, setManualRotation] = useState<number>(0);
  const [isSensorActive, setIsSensorActive] = useState<boolean>(false);
  const [sensorError, setSensorError] = useState<string | null>(null);

  const qiblaAngle = calculateQiblaDirection(location.latitude, location.longitude);
  const distanceKm = calculateDistanceToKaabaKm(location.latitude, location.longitude);
  const cardinalDirection = getCompassHeadingName(qiblaAngle);

  // Attempt to listen to hardware sensor if mobile device supports it
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading is available on iOS Safari
      const webkitHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (typeof webkitHeading === 'number') {
        setDeviceHeading(webkitHeading);
        setIsSensorActive(true);
      } else if (e.alpha !== null) {
        // Standard Android heading
        const heading = 360 - e.alpha;
        setDeviceHeading((heading + 360) % 360);
        setIsSensorActive(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const requestCompassPermission = async () => {
    // iOS 13+ requires explicit user gesture to grant orientation permissions
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceOrientation?.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission();
        if (response === 'granted') {
          setIsSensorActive(true);
          setSensorError(null);
        } else {
          setSensorError('Compass sensor permission denied. You can rotate manually below.');
        }
      } catch (err) {
        setSensorError('Compass permission failed. Use manual compass dial below.');
      }
    } else {
      // Non-iOS or desktop
      if (!isSensorActive) {
        setSensorError('Hardware orientation sensor unavailable on this device. Use manual dial.');
      }
    }
  };

  // Compass effective rotation:
  // If sensor is active, rotate the dial opposite to device heading so North aligns.
  // Otherwise use manual slider rotation.
  const currentHeading = deviceHeading !== null ? deviceHeading : manualRotation;
  const compassDialRotation = -currentHeading;
  const needleRotation = qiblaAngle - currentHeading;

  // Check if phone/needle is pointing closely to Qibla (within ±4 degrees)
  const isAlignedWithQibla = Math.abs((needleRotation + 360) % 360) < 5 || Math.abs((needleRotation + 360) % 360 - 360) < 5;

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
      {/* Top Details Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Qibla Direction (Kiblat)</h2>
            <span className="font-amiri text-emerald-400 text-lg">القبلة</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exact bearing to the Holy Kaaba in Makkah Al-Mukarramah
          </p>
        </div>

        {/* Location & Bearing Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs">
            <span className="text-slate-400">Bearing: </span>
            <span className="font-bold text-emerald-300 font-mono">{qiblaAngle.toFixed(1)}°</span>{' '}
            <span className="font-semibold text-slate-200">({cardinalDirection})</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs">
            <span className="text-slate-400">Distance: </span>
            <span className="font-bold text-teal-300 font-mono">{distanceKm.toLocaleString()} km</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Compass Visual */}
      <div className="flex flex-col items-center justify-center py-4">
        {/* Alignment Indicator Banner */}
        {isAlignedWithQibla && (
          <div className="mb-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-pulse">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Facing Holy Kaaba (Qibla)!</span>
          </div>
        )}

        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Outer Ring & Graduations */}
          <div
            className="absolute inset-0 rounded-full border-4 border-slate-800 shadow-2xl transition-transform duration-300 ease-out flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            style={{ transform: `rotate(${compassDialRotation}deg)` }}
          >
            {/* Cardinal Markers */}
            <div className="absolute top-2.5 text-xs font-bold text-rose-400 font-mono">N</div>
            <div className="absolute bottom-2.5 text-xs font-bold text-slate-400 font-mono">S</div>
            <div className="absolute right-2.5 text-xs font-bold text-slate-400 font-mono">E</div>
            <div className="absolute left-2.5 text-xs font-bold text-slate-400 font-mono">W</div>

            {/* Dial Tick marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute w-full h-full flex justify-center pointer-events-none"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div className={`w-0.5 ${deg % 90 === 0 ? 'h-3 bg-slate-500' : 'h-1.5 bg-slate-700'} mt-1`} />
              </div>
            ))}

            {/* Golden Kaaba Marker on the rotating ring */}
            <div
              className="absolute w-full h-full flex justify-center pointer-events-none"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
              <div className="relative -top-2 flex flex-col items-center">
                <div className="w-6 h-6 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/50 border border-amber-200">
                  <span className="font-amiri text-xs font-black">كعبة</span>
                </div>
                <div className="w-1 h-3 bg-amber-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Center Needle pointing to Qibla */}
          <div
            className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            {/* Upper Pointer (Points to Qibla) */}
            <div className="absolute top-10 flex flex-col items-center">
              <div className="w-0 h-0 border-x-8 border-x-transparent border-b-[40px] border-b-emerald-400 filter drop-shadow-[0_2px_8px_rgba(52,211,153,0.5)]" />
              <div className="w-2 h-16 bg-emerald-500 rounded-full" />
            </div>

            {/* Lower Counterweight */}
            <div className="absolute bottom-12 flex flex-col items-center opacity-40">
              <div className="w-2 h-12 bg-slate-600 rounded-full" />
              <div className="w-0 h-0 border-x-6 border-x-transparent border-t-[24px] border-t-slate-600" />
            </div>

            {/* Pivot Center Hub */}
            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>

        {/* Live Heading Angle readout */}
        <div className="mt-4 text-center">
          <div className="text-xs text-slate-400">Current Orientation</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {Math.round(currentHeading)}°
          </div>
        </div>
      </div>

      {/* Manual Compass Rotation Slider & Sensor Request */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {isSensorActive ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live device compass sensor connected
              </span>
            ) : (
              <span>Drag slider or turn phone to orient compass</span>
            )}
          </div>

          <button
            onClick={requestCompassPermission}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:bg-slate-700 transition-colors w-fit"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enable Mobile Gyro Sensor</span>
          </button>
        </div>

        {sensorError && (
          <div className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
            {sensorError}
          </div>
        )}

        {/* Manual orientation slider for desktop or devices without gyroscope */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0° (North)</span>
            <span>Manual Heading Adjustment: {manualRotation}°</span>
            <span>360°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={manualRotation}
            onChange={(e) => setManualRotation(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Guidelines for accurate prayer direction */}
      <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tips for Accurate Qibla:</span>
        </div>
        <p>• Lay the device flat on a horizontal table away from metallic objects or speakers.</p>
        <p>• Align the compass needle with the golden Kaaba mark (<span className="text-amber-400 font-semibold">{qiblaAngle.toFixed(1)}° {cardinalDirection}</span>) to face Mecca.</p>
      </div>
    </div>
  );
};
