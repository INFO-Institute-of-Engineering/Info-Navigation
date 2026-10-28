import React from 'react'
import type { NavigationProgress } from '../types/navigation'
import {
  ArrowUp,
  ArrowUpRight,
  ArrowRight,
  ArrowUpLeft,
  ArrowLeft,
  CheckCircle2,
  X,
  AlertTriangle,
  RotateCcw,
  Footprints,
  Play,
  Square,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react'
import { formatDistance, formatDuration } from '../utils/distance'

interface NavigationPanelProps {
  progress: NavigationProgress
  onStopNavigation: () => void
  onStartSimulation?: (speed?: number) => void
  onStopSimulation?: () => void
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  progress,
  onStopNavigation,
  onStartSimulation,
  onStopSimulation,
}) => {
  if (!progress.isActive || !progress.destination || !progress.currentRoute) {
    return null
  }

  const {
    destination,
    currentRoute,
    currentStepIndex,
    remainingDistanceMeters,
    remainingDurationSeconds,
    progressPercentage,
    isOffRoute,
    isRerouting,
    hasArrived,
    isSimulating,
  } = progress

  const currentStep = currentRoute.steps[currentStepIndex] || currentRoute.steps[0]

  // Determine maneuver icon from instruction text
  const getManeuverIcon = (instruction: string) => {
    const text = instruction.toLowerCase()
    if (text.includes('arrive') || hasArrived) return <CheckCircle2 className="w-7 h-7 text-emerald-400" />
    if (text.includes('right')) {
      if (text.includes('slight')) return <ArrowUpRight className="w-7 h-7 text-white" />
      return <ArrowRight className="w-7 h-7 text-white" />
    }
    if (text.includes('left')) {
      if (text.includes('slight')) return <ArrowUpLeft className="w-7 h-7 text-white" />
      return <ArrowLeft className="w-7 h-7 text-white" />
    }
    return <ArrowUp className="w-7 h-7 text-white" />
  }

  return (
    <>
      {/* Top Turn Guidance Box (Google Maps Style Maneuver Banner) */}
      <div className="absolute top-0 left-0 right-0 md:top-3 md:left-4 md:right-auto md:w-96 z-40 animate-slide-down pointer-events-auto">
        <div className="glass-panel-dark text-white rounded-b-3xl md:rounded-3xl shadow-2xl border-b md:border border-white/20 p-3.5 flex flex-col gap-2.5">
          {/* Step Maneuver & Direction */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              hasArrived
                ? 'bg-emerald-500 shadow-emerald-500/40 animate-pulse'
                : 'bg-emerald-600 shadow-emerald-950/40'
            }`}>
              {getManeuverIcon(currentStep.instruction)}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              {hasArrived ? (
                <div className="flex flex-col">
                  <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Destination Reached!
                  </span>
                  <span className="text-xs text-slate-200 font-semibold truncate">{destination.name}</span>
                </div>
              ) : isRerouting ? (
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs py-1">
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Rerouting walking path...</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-400">
                    {currentStep.distanceMeters > 0
                      ? `In ${formatDistance(currentStep.distanceMeters)}`
                      : 'Destination ahead'}
                  </span>
                  <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug line-clamp-2">
                    {currentStep.instruction}
                  </h3>
                </div>
              )}
            </div>

            <button
              onClick={onStopNavigation}
              title="Stop walking navigation"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Off-Route Alert notice */}
          {isOffRoute && !isRerouting && !isSimulating && (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Off planned path. Rerouting automatically...</span>
            </div>
          )}

          {/* Dynamic Progress Bar */}
          <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                hasArrived ? 'bg-emerald-400 w-full' : 'bg-emerald-500'
              }`}
              style={{ width: `${hasArrived ? 100 : progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Docked Trip Summary Bar (Google Maps Style Bottom HUD) */}
      <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto md:w-96 z-40 animate-slide-up pointer-events-auto">
        <div className="glass-panel text-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl border-t md:border border-white/80 p-3 sm:p-3.5 pb-6 sm:pb-3.5 flex items-center justify-between gap-2.5">
          {/* Distance & Time Metrics */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Remaining</span>
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {hasArrived ? '0 m' : formatDistance(remainingDistanceMeters)}
              </span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Walk Time</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">
                {hasArrived ? 'Arrived' : formatDuration(remainingDurationSeconds)}
              </span>
            </div>
          </div>

          {/* Action Buttons: Simulate Walk + Stop */}
          <div className="flex items-center gap-1.5">
            {!hasArrived && (
              <button
                onClick={() => {
                  if (isSimulating) {
                    onStopSimulation?.()
                  } else {
                    onStartSimulation?.(2.0)
                  }
                }}
                title={isSimulating ? 'Stop walk simulation' : 'Test simulate walking to destination'}
                className={`px-3 py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95 ${
                  isSimulating
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Demo</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Demo Walk</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onStopNavigation}
              title="Exit navigation"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-colors shrink-0"
            >
              <Footprints className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps Style Destination Reached Modal Popup */}
      {hasArrived && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="glass-panel text-slate-900 rounded-3xl shadow-2xl border border-white/80 p-5 sm:p-6 max-w-sm w-full flex flex-col items-center text-center gap-3 animate-scale-up">
            {/* Big Celebratory Checkmark Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md">
                ★
              </div>
            </div>

            {/* Arrival Text */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 font-mono">
                WALKING TRIP COMPLETED
              </span>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                Destination Reached!
              </h2>
              <p className="text-xs text-slate-600 font-medium px-2">
                You have safely arrived at{' '}
                <span className="font-extrabold text-slate-900">{destination.name}</span>.
              </p>
            </div>

            {/* Trip Stats Pill */}
            <div className="w-full bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 flex items-center justify-around text-center my-1">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Remaining</span>
                <span className="text-sm font-black text-emerald-700">0 meters</span>
              </div>
              <div className="w-px h-6 bg-emerald-200" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Status</span>
                <span className="text-sm font-black text-emerald-700">Arrived</span>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={onStopNavigation}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Done &amp; Explore Here</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
