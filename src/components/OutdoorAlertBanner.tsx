import React from 'react'
import type { Coordinates } from '../types/navigation'
import { AlertCircle, Navigation, Maximize2 } from 'lucide-react'
import { calculateHaversineDistance, formatDistance } from '../utils/distance'
import { CAMPUS_CENTER } from '../data/campusBoundary'

interface OutdoorAlertBannerProps {
  userCoords: Coordinates | null
  isInsideCampus: boolean
  onCenterCampus: () => void
  onRecenterGps?: () => void
}

export const OutdoorAlertBanner: React.FC<OutdoorAlertBannerProps> = ({
  userCoords,
  isInsideCampus,
  onCenterCampus,
  onRecenterGps,
}) => {
  if (!userCoords) return null

  // If outside campus geofence
  if (!isInsideCampus) {
    const distToCampus = calculateHaversineDistance(
      { latitude: userCoords.latitude, longitude: userCoords.longitude },
      { latitude: CAMPUS_CENTER[0], longitude: CAMPUS_CENTER[1] }
    )

    return (
      <div className="absolute top-20 md:top-24 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:w-[500px] z-30 animate-fade-in pointer-events-auto">
        <div className="glass-panel-dark text-white rounded-2xl shadow-google border border-blue-500/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-blue-300">
                Live GPS Active ({formatDistance(distToCampus)} from campus)
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                Lat: {userCoords.latitude.toFixed(5)}, Lon: {userCoords.longitude.toFixed(5)} (±{Math.round(userCoords.accuracy || 10)}m)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onCenterCampus}
              title="Pan to INFO campus map"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold whitespace-nowrap shadow transition-colors flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Campus Map</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Inside campus: clean subtle live status indicator
  return (
    <div className="absolute top-20 md:top-24 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:w-[420px] z-30 animate-fade-in pointer-events-auto">
      <div className="glass-panel text-slate-900 rounded-2xl shadow-google border border-slate-200/80 p-2.5 px-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 truncate">
              📍 Real-Time Live GPS Active
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