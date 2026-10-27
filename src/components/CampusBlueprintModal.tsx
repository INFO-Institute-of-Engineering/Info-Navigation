import React, { useState } from 'react'
import type { CampusLocation } from '../types/campus'
import { X, ZoomIn, ZoomOut, RotateCcw, MapPin, CheckCircle2 } from 'lucide-react'

interface CampusBlueprintModalProps {
  isOpen: boolean
  onClose: () => void
  locations: CampusLocation[]
  selectedDestination: CampusLocation | null
  onSelectDestination: (dest: CampusLocation) => void
}

export const CampusBlueprintModal: React.FC<CampusBlueprintModalProps> = ({
  isOpen,
  onClose,
  locations,
  selectedDestination,
  onSelectDestination,
}) => {
  const [zoom, setZoom] = useState(1)

  if (!isOpen) return null

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75))
  const handleResetZoom = () => setZoom(1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-extrabold text-white">
                INFO Institute of Engineering — Campus Infrastructure Blueprint
              </h2>
              <span className="text-xs text-slate-400">
                Tap any building to select and navigate on live satellite map
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 text-slate-300">
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="p-1 hover:text-white rounded hover:bg-slate-700"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1 font-semibold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="p-1 hover:text-white rounded hover:bg-slate-700"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset Zoom"
                className="p-1 hover:text-white rounded hover:bg-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Blueprint Viewer Area */}
        <div className="relative flex-1 overflow-auto bg-slate-950 p-4 flex items-center justify-center">
          <div
            className="relative transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* High-Resolution Infrastructure Blueprint */}
            <img
              src="/images/campus-infrastructure.jpg"
              alt="INFO Institute Blueprint"
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-slate-800"
              onError={(e) => {
                // Fallback to secondary blueprint if main is not accessible
                e.currentTarget.src = '/images/campus-blueprint.jpg'
              }}
            />
          </div>
        </div>

        {/* Interactive Building Quick Selector Strip */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-2">
            Quick Select:
          </span>
          {locations.map((loc) => {
            const isSelected = selectedDestination?.id === loc.id
            return (
              <button
                key={loc.id}
                onClick={() => {
                  onSelectDestination(loc)
                  onClose()
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: loc.color || '#3b82f6' }}
                />
                <span>{loc.name}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
