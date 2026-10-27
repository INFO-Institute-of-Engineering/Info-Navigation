import React, { useState } from 'react'
import type { CampusLocation } from '../types/campus'
import type { WalkingRoute } from '../types/navigation'
import {
  Navigation,
  Clock,
  MapPin,
  X,
  Share2,
  Image as ImageIcon,
  CheckCircle2,
  Accessibility,
  Building,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { formatDistance, formatDuration } from '../utils/distance'

interface DestinationCardProps {
  destination: CampusLocation
  currentRoute: WalkingRoute | null
  onStartNavigation: () => void
  onClose: () => void
  onOpenQrShare: () => void
  isNavigating: boolean
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  currentRoute,
  onStartNavigation,
  onClose,
  onOpenQrShare,
  isNavigating,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isNavigating) return null

  const walkingDistance = currentRoute ? formatDistance(currentRoute.totalDistanceMeters) : null
  const walkingTime = currentRoute ? formatDuration(currentRoute.estimatedDurationSeconds) : null

  return (
    <div className="absolute bottom-4 left-3 right-3 md:left-4 md:right-auto md:w-96 z-40 animate-slide-up">
      <div className="glass-panel rounded-3xl shadow-sheet border border-white/80 p-4 flex flex-col gap-3">
        {/* Mobile Drag / Expand Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex md:hidden items-center justify-center cursor-pointer -mt-1 -mb-1"
        >
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Card Header: Category & Close */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white"
              style={{ backgroundColor: destination.color || '#2563eb' }}
            >
              {destination.category}
            </span>
            {destination.buildingInfo?.code && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {destination.buildingInfo.code}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Walking Metrics */}
        <div className="flex flex-col">
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            {destination.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {destination.description}
          </p>
        </div>

        {/* Walking Route Quick Metrics */}
        {currentRoute && (
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-blue-50/80 border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  Walking Distance
                </span>
                <span className="text-xs font-bold text-blue-900">{walkingDistance}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-slate-500 uppercase">
                  Estimated Time
                </span>
                <span className="text-xs font-bold text-slate-900">{walkingTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Building Details */}
        <div className={`${isExpanded ? 'flex' : 'hidden md:flex'} flex-col gap-2 pt-1`}>
          {destination.buildingInfo?.facilities && destination.buildingInfo.facilities.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Facilities & Features
              </span>
              <div className="flex flex-wrap gap-1">
                {destination.buildingInfo.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {destination.accessibilityInfo && (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 bg-slate-50 p-2 rounded-xl">
              <Accessibility className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                {destination.accessibilityInfo.wheelchairAccessible
                  ? 'Wheelchair accessible entrance available.'
                  : 'Standard steps entrance.'}{' '}
                {destination.accessibilityInfo.elevatorAvailable ? 'Elevator available.' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onStartNavigation}
            className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Start Live Walking</span>
          </button>

          <button
            onClick={onOpenQrShare}
            title="Open on phone via QR code"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
