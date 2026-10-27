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
      <div className="w-full animate-fade-in pointer-events-auto">
        <div className="glass-panel text-slate-900 rounded-2xl shadow-google border border-blue-400/50 p-2 sm:p-2.5 px-3 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
              <Crosshair className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">
                {isLoading ? 'Detecting your location...' : 'Enable Real-Time Location'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-600 truncate">
                {error ? error : 'Allow location to navigate live on campus'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onRequestLocation && (
              <button
                onClick={onRequestLocation}
                disabled={isLoading}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-bold whitespace-nowrap shadow transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Crosshair className="w-3 h-3" />
                <span>{isLoading ? 'Locating...' : 'Allow'}</span>
              </button>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
        <div className="w-full flex justify-start animate-fade-in pointer-events-auto">
          <button
            onClick={() => setIsDismissed(false)}
            className="glass-panel-dark text-amber-300 px-3 py-1 rounded-full text-[10.5px] font-bold shadow-md border border-amber-500/40 flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Apart from college area ({formatDistance(distToCampus)})</span>
          </button>
        </div>
      )
    }

    return (
      <div className="w-full animate-fade-in pointer-events-auto">
        <div className="glass-panel-dark text-white rounded-2xl shadow-google border border-amber-500/50 p-2.5 sm:p-3 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-extrabold text-amber-300 tracking-wide truncate">
                  ⚠️ Apart from college area
                </span>
                <span className="text-[10px] text-slate-300 leading-tight line-clamp-1">
                  Current location is {formatDistance(distToCampus)} away from INFO Institute.
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
            <span className="text-[9px] text-slate-400 font-mono truncate">
              GPS: {userCoords.latitude.toFixed(4)}, {userCoords.longitude.toFixed(4)} (±{Math.round(userCoords.accuracy || 10)}m)
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              {onRecenterGps && (
                <button
                  onClick={onRecenterGps}
                  title="View your current location pin"
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-bold transition-colors flex items-center gap-1 border border-slate-600"
                >
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span>My Pin</span>
                </button>
              )}
              <button
                onClick={onCenterCampus}
                title="Pan to INFO college campus map"
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow"
              >
                <Maximize2 className="w-3 h-3" />
                <span>View Campus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. User is INSIDE the college campus: Clean screen, no intrusive overlay needed
  return null
}