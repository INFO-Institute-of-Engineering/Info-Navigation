import React, { useState } from 'react'
import type { Coordinates } from '../types/navigation'
import { AlertTriangle, Navigation, Maximize2, Crosshair, X, MapPin } from 'lucide-react'
import { calculateHaversineDistance, formatDistance } from '../utils/distance'
import { CAMPUS_CENTER } from '../data/campusBoundary'

interface OutdoorAlertBannerProps {
  userCoords: Coordinates | null
  isInsideCampus: boolean
  isLoading?: boolean
  error?: string | null
  onRequestLocation?: () => void
  onCenterCampus: () => void
  onRecenterGps?: () => void
}

export const OutdoorAlertBanner: React.FC<OutdoorAlertBannerProps> = ({
  userCoords,
  isInsideCampus,
  isLoading,
  error,
  onRequestLocation,
  onCenterCampus,
  onRecenterGps,
}) => {
  const [isDismissed, setIsDismissed] = useState(false)

  // 1. If user has NOT granted location or device location is off (Google Maps style prompt)
  if (!userCoords) {
    if (isDismissed) return null

    return (
      <div className="absolute top-[138px] md:top-20 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:w-[460px] z-30 animate-fade-in pointer-events-auto">
        <div className="glass-panel text-slate-900 rounded-2xl shadow-google border border-blue-400/50 p-2.5 px-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <Crosshair className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">
                {isLoading ? 'Detecting your location...' : 'Enable Real-Time Location'}
              </span>
              <span className="text-[10px] text-slate-600 truncate">
                {error ? error : 'Allow location to see your real-time position on campus'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onRequestLocation && (
              <button
                onClick={onRequestLocation}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold whitespace-nowrap shadow transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Crosshair className="w-3 h-3" />
                <span>{isLoading ? 'Locating...' : 'Allow Location'}</span>
              </button>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 2. If user is OUTSIDE the college area ("apart from the college area")
  if (!isInsideCampus) {
    const distToCampus = calculateHaversineDistance(
      { latitude: userCoords.latitude, longitude: userCoords.longitude },
      { latitude: CAMPUS_CENTER[0], longitude: CAMPUS_CENTER[1] }
    )

    if (isDismissed) {
      // Small floating pill to reopen if dismissed
      return (
        <button
          onClick={() => setIsDismissed(false)}
          className="absolute top-[138px] md:top-20 left-3 z-30 glass-panel-dark text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border border-amber-500/40 flex items-center gap-1.5 animate-fade-in pointer-events-auto"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Apart from college area ({formatDistance(distToCampus)})</span>
        </button>
      )
    }

    return (
      <div className="absolute top-[138px] md:top-20 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:w-[500px] z-30 animate-fade-in pointer-events-auto">
        <div className="glass-panel-dark text-white rounded-2xl shadow-google border border-amber-500/50 p-3.5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-amber-300 tracking-wide">
                  ⚠️ You are apart from the college area
                </span>
                <span className="text-[11px] text-slate-300">
                  Your current location is outside INFO Institute of Engineering campus ({formatDistance(distToCampus)} away).
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-mono truncate">
              GPS: {userCoords.latitude.toFixed(4)}, {userCoords.longitude.toFixed(4)} (±{Math.round(userCoords.accuracy || 10)}m)
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {onRecenterGps && (
                <button
                  onClick={onRecenterGps}
                  title="View your current location pin"
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 border border-slate-600"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>My Location</span>
                </button>
              )}
              <button
                onClick={onCenterCampus}
                title="Pan to INFO college campus map"
                className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>College Campus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. User is INSIDE the college campus
  return (
    <div className="absolute top-20 md:top-24 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:w-[420px] z-30 animate-fade-in pointer-events-auto">
      <div className="glass-panel text-slate-900 rounded-2xl shadow-google border border-emerald-500/40 p-2.5 px-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate">
              📍 Live Campus GPS Active (Inside College Area)
            </span>
            <span className="text-[10px] text-slate-500 font-mono truncate">
              {userCoords.latitude.toFixed(5)}, {userCoords.longitude.toFixed(5)} • Accuracy: ±{Math.round(userCoords.accuracy || 5)}m
            </span>
          </div>
        </div>

        {onRecenterGps && (
          <button
            onClick={onRecenterGps}
            title="Recenter on live location"
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <Navigation className="w-3 h-3 text-blue-600" />
            <span>Recenter</span>
          </button>
        )}
      </div>
    </div>
  )
}