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
  Sparkles,
  Award,
  Monitor,
  Star,
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
    <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto md:w-96 z-40 animate-slide-up">
      <div className="glass-panel rounded-t-3xl md:rounded-3xl shadow-2xl border-t md:border border-white/80 p-3.5 sm:p-4 pb-6 sm:pb-4 flex flex-col gap-2.5 max-h-[75vh] md:max-h-[85vh] overflow-y-auto">
        {/* Mobile Drag / Expand Bar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex md:hidden items-center justify-center cursor-pointer -mt-1 pb-1"
        >
          <div className="w-10 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors" />
        </div>

        {/* Card Header: Category & Close */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm"
              style={{ backgroundColor: destination.color || '#2563eb' }}
            >
              {destination.category}
            </span>
            {destination.buildingInfo?.code && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                {destination.buildingInfo.code}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            title="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col">
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            {destination.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
            {destination.description}
          </p>
        </div>

        {/* Key Highlighted Facilities (Always Visible for Instant Recognition) */}
        {destination.buildingInfo?.highlightedFacilities && destination.buildingInfo.highlightedFacilities.length > 0 && (
          <div className={`p-2.5 rounded-2xl border flex flex-col gap-1.5 shadow-xs transition-all ${
            destination.id === 'office-room'
              ? 'bg-gradient-to-r from-amber-50 via-amber-50/50 to-orange-50/30 border-amber-300'
              : 'bg-gradient-to-r from-sky-50 via-blue-50/50 to-indigo-50/30 border-sky-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className={`w-3.5 h-3.5 ${
                  destination.id === 'office-room' ? 'text-amber-600' : 'text-sky-600'
                }`} />
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  destination.id === 'office-room' ? 'text-amber-900' : 'text-sky-900'
                }`}>
                  {destination.id === 'office-room' ? 'Key Administrative Offices' : 'Featured Computing Laboratories'}
                </span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                destination.id === 'office-room' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
              }`}>
                Highlighted
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {destination.buildingInfo.highlightedFacilities.map((fac, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black tracking-wide shadow-xs border transition-transform active:scale-95 ${
                    destination.id === 'office-room'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/25'
                      : 'bg-blue-600 text-white border-blue-700 shadow-blue-600/25'
                  }`}
                >
                  {destination.id === 'office-room' ? (
                    <Award className="w-3.5 h-3.5 text-amber-100 shrink-0" />
                  ) : (
                    <Monitor className="w-3.5 h-3.5 text-blue-100 shrink-0" />
                  )}
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Walking Route Quick Metrics */}
        {currentRoute && (
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-blue-50/90 border border-blue-100/80 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Navigation className="w-4 h-4 fill-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
                  Walking Distance
                </span>
                <span className="text-xs font-bold text-blue-900 truncate">{walkingDistance}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
                  Estimated Time
                </span>
                <span className="text-xs font-bold text-slate-900 truncate">{walkingTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Building Details */}
        <div className={`${isExpanded ? 'flex' : 'hidden md:flex'} flex-col gap-2 pt-0.5`}>
          {destination.buildingInfo?.facilities && destination.buildingInfo.facilities.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Facilities & Features
              </span>
              <div className="flex flex-wrap gap-1">
                {destination.buildingInfo.facilities.map((fac, idx) => {
                  const isHighlighted = destination.buildingInfo?.highlightedFacilities?.includes(fac)
                  return (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isHighlighted
                          ? destination.id === 'office-room'
                            ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                            : 'bg-blue-100 text-blue-900 font-bold border border-blue-300'
                          : 'bg-slate-100 text-slate-700 font-medium'
                      }`}
                    >
                      {isHighlighted && <Star className="w-2.5 h-2.5 fill-current shrink-0" />}
                      {fac}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {destination.accessibilityInfo && (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
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
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Start Live Walking</span>
          </button>

          <button
            onClick={onOpenQrShare}
            title="Open on phone via QR code"
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition-colors shrink-0"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
