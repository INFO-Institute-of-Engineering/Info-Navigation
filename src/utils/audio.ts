/**
 * Synthesizes a gentle, high-clarity 2-tone Google Maps style arrival chime
 * using the standard Web Audio API. 100% offline, zero network requests.
 */
export function playArrivalChime(): void {
  if (typeof window === 'undefined') return

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

    if (!AudioContextClass) return

    const ctx = new AudioContextClass()

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime)
    gain1.gain.setValueAtTime(0.18, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.35)

    // Note 2: B5 (987.77 Hz) - higher celebratory chime
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.18)
    gain2.gain.setValueAtTime(0.24, ctx.currentTime + 0.18)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.18)
    osc2.stop(ctx.currentTime + 0.75)
  } catch {
    // Audio autoplay restrictions or unsupported
  }

  // Haptic feedback vibration if supported on mobile
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate([120, 60, 180])
    } catch {
      // ignore
    }
  }
}
