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
    <div className="absolute top-3 left-3 right-3 md:left-4 md:right-auto md:w-96 z-40 flex flex-col gap-2 animate-slide-up">
      {/* Top Turn Guidance Box (Google Maps Style Green/Navy Banner) */}
      <div className="glass-panel-dark text-white rounded-3xl shadow-sheet border border-white/20 p-4 flex flex-col gap-3">
        {/* Step Maneuver & Direction */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/50">
            {getManeuverIcon(currentStep.instruction)}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            {hasArrived ? (
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-emerald-400">You have arrived!</span>
                <span className="text-xs text-slate-300 font-medium">{destination.name}</span>
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
                <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-2">
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
          <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Off planned walking path. Rerouting automatically...</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Live Trip Summary */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</span>
              <span className="text-sm font-extrabold text-white">
                {formatDistance(remainingDistanceMeters)}
              </span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Walk Time</span>
              <span className="text-sm font-extrabold text-emerald-400">
                {formatDuration(remainingDurationSeconds)}
              </span>
            </div>
          </div>

          <button
            onClick={onStopNavigation}
            className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs shadow-md transition-colors"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  )
}
