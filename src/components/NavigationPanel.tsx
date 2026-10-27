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
} from 'lucide-react'
import { formatDistance, formatDuration } from '../utils/distance'

interface NavigationPanelProps {
  progress: NavigationProgress
  onStopNavigation: () => void
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  progress,
  onStopNavigation,
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
  } = progress

  const currentStep = currentRoute.steps[currentStepIndex] || currentRoute.steps[0]

  // Determine maneuver icon from instruction text
  const getManeuverIcon = (instruction: string) => {
    const text = instruction.toLowerCase()
    if (text.includes('arrive')) return <CheckCircle2 className="w-7 h-7 text-emerald-400" />
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
        <div className="glass-panel-dark text-white rounded-b-3xl md:rounded-3xl shadow-2xl border-b md:border border-white/20 p-3 sm:p-3.5 flex flex-col gap-2.5">
          {/* Step Maneuver & Direction */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/40">
              {getManeuverIcon(currentStep.instruction)}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              {hasArrived ? (
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-emerald-400">You have arrived!</span>
                  <span className="text-xs text-slate-300 font-medium truncate">{destination.name}</span>
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
          {isOffRoute && !isRerouting && (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Off planned path. Rerouting automatically...</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Docked Trip Summary Bar (Google Maps Style Bottom HUD) */}
      <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto md:w-96 z-40 animate-slide-up pointer-events-auto">
        <div className="glass-panel text-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl border-t md:border border-white/80 p-3 sm:p-3.5 pb-6 sm:pb-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Remaining</span>
              <span className="text-sm font-extrabold text-slate-900">
                {formatDistance(remainingDistanceMeters)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Walk Time</span>
              <span className="text-sm font-extrabold text-emerald-600">
                {formatDuration(remainingDurationSeconds)}
              </span>
            </div>
          </div>

          <button
            onClick={onStopNavigation}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Stop Navigation</span>
          </button>
        </div>
      </div>
    </>
  )
}
