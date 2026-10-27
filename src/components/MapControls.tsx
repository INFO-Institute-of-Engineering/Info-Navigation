import React from 'react'
import {
  Layers,
  Navigation,
  Maximize2,
  Box,
  Share2,
} from 'lucide-react'

interface MapControlsProps {
  isSatellite: boolean
  onToggleSatellite: () => void
  isTilted: boolean
  onToggleTilt: () => void
  onRecenterGps: () => void
  onCampusOverview: () => void
  onOpenQrShare: () => void
  gpsLoading: boolean
  hasGps: boolean
}

export const MapControls: React.FC<MapControlsProps> = ({
  isSatellite,
  onToggleSatellite,
  isTilted,
  onToggleTilt,
  onRecenterGps,
  onCampusOverview,
  onOpenQrShare,
  gpsLoading,
  hasGps,
}) => {
  return (
    <div className="absolute right-2.5 top-[112px] md:top-24 md:right-4 z-30 flex flex-col gap-2">
      {/* Satellite / Street Map Toggle */}
      <button
        onClick={onToggleSatellite}
        title={isSatellite ? 'Switch to Street Map' : 'Switch to Satellite View'}
        className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl glass-panel shadow-google flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white active:scale-95 transition-all group"
      >
        <Layers className={`w-4 h-4 md:w-5 md:h-5 ${isSatellite ? 'text-blue-600' : 'text-slate-600'}`} />
        <span className="sr-only">Toggle Satellite</span>
      </button>

      {/* 3D Perspective Tilt Toggle */}
      <button
        onClick={onToggleTilt}
        title={isTilted ? 'Switch to 2D Top-Down View' : 'Switch to 3D Tilted Perspective'}
        className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl glass-panel shadow-google flex items-center justify-center transition-all active:scale-95 ${
          isTilted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-700 hover:text-blue-600 hover:bg-white'
        }`}
      >
        <Box className="w-4 h-4 md:w-5 md:h-5" />
        <span className="sr-only">Toggle 3D Tilt</span>
      </button>

      {/* Recenter on GPS location */}
      <button
        onClick={onRecenterGps}
        disabled={gpsLoading}
        title="Recenter on My Location"
        className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl glass-panel shadow-google flex items-center justify-center transition-all active:scale-95 ${
          hasGps
            ? 'text-blue-600 hover:bg-blue-50'
            : 'text-slate-700 hover:text-blue-600 hover:bg-white'
        }`}
      >
        <Navigation
          className={`w-4 h-4 md:w-5 md:h-5 ${gpsLoading ? 'animate-spin text-amber-500' : hasGps ? 'text-blue-600 fill-blue-600' : ''}`}
        />
        <span className="sr-only">My GPS Location</span>
      </button>

      {/* College Campus Overview */}
      <button
        onClick={onCampusOverview}
        title="College Campus Overview"
        className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl glass-panel shadow-google flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white active:scale-95 transition-all"
      >
        <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
        <span className="sr-only">Campus Overview</span>
      </button>

      {/* QR Share for Mobile */}
      <button
        onClick={onOpenQrShare}
        title="Open on Mobile / Share QR"
        className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl glass-panel shadow-google flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white active:scale-95 transition-all"
      >
        <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        <span className="sr-only">Share Route QR</span>
      </button>
    </div>
  )
}
