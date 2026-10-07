/**
 * Web Audio API based Adhan and notification synthesizers.
 * Works reliably offline and in sandbox without external audio assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a resonant, peaceful meditation chime / singing bowl tone
 */
export function playChimeTone() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const baseFreq = 432; // Calming frequency
    const harmonics = [1, 2.02, 3.01, 4.2];
    const gains = [0.4, 0.2, 0.1, 0.05];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * h, now);

      gain.gain.setValueAtTime(gains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  } catch (e) {
    console.error('Audio playback error', e);
  }
}

/**
 * Plays gentle double beep alert
 */
export function playBeepTone() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [0, 0.22].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + offset);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.16);
    });
  } catch (e) {
    console.error('Audio playback error', e);
  }
}

/**
 * Plays an evocative synthesized melodic Adhan motif (Bayati scale: "Allahu Akbar, Allahu Akbar")
 */
export function playAdhanMotif(onEnded?: () => void) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sequence of notes (Hz, duration in seconds, gap)
    // Bayati/Rast prayer call motif
    const notes = [
      { f: 293.66, dur: 0.9, rest: 0.1 },  // D4: Al-
      { f: 329.63, dur: 0.6, rest: 0.05 }, // E4: la-
      { f: 349.23, dur: 1.4, rest: 0.2 },  // F4: hu
      { f: 392.00, dur: 0.7, rest: 0.05 }, // G4: Ak-
      { f: 349.23, dur: 0.5, rest: 0.05 }, // F4
      { f: 329.63, dur: 1.8, rest: 0.4 },  // E4: bar
      { f: 293.66, dur: 0.8, rest: 0.1 },  // D4: Al-
      { f: 349.23, dur: 0.8, rest: 0.05 }, // F4: la-
      { f: 392.00, dur: 1.2, rest: 0.1 },  // G4: hu
      { f: 440.00, dur: 0.9, rest: 0.1 },  // A4: Ak-
      { f: 392.00, dur: 0.6, rest: 0.05 }, // G4
      { f: 349.23, dur: 0.6, rest: 0.05 }, // F4
      { f: 293.66, dur: 2.2, rest: 0.5 },  // D4: bar
    ];

    let currentOffset = 0;
    notes.forEach((note) => {
      const startTime = now + currentOffset;
      const stopTime = startTime + note.dur;

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(note.f * 2, startTime); // Harmonic octave

      // Soft human-like vibrato / portamento
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(stopTime);
      osc2.start(startTime);
      osc2.stop(stopTime);

      currentOffset += note.dur + note.rest;
    });

    if (onEnded) {
      setTimeout(() => {
        onEnded();
      }, (currentOffset + 0.5) * 1000);
    }
  } catch (e) {
    console.error('Adhan audio playback error', e);
  }
}

/**
 * Click sound for Tasbih counter
 */
export function playTasbihClick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Ignore muted audio context
  }
}
