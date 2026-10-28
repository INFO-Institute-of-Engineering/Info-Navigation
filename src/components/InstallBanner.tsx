import React from 'react'
import { Download, X, Smartphone } from 'lucide-react'

interface InstallBannerProps {
  canInstall: boolean
  isInstalled: boolean
  isDismissed: boolean
  onInstall: () => void
  onDismiss: () => void
  isNavigating: boolean
}

export const InstallBanner: React.FC<InstallBannerProps> = ({
  canInstall,
  isInstalled,
  isDismissed,
  onInstall,
  onDismiss,
  isNavigating,
}) => {
  if (!canInstall || isInstalled || isDismissed || isNavigating) {
    return null
  }

  return (
    <div className="fixed bottom-3 right-2.5 left-2.5 sm:left-auto sm:right-4 sm:bottom-4 z-30 animate-slide-up pointer-events-auto">
      <div className="glass-panel text-slate-900 rounded-2xl shadow-google border border-emerald-300/80 p-2.5 sm:px-3 sm:py-2.5 flex items-center justify-between gap-3 bg-white/95 max-w-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 leading-tight truncate">
              Install INFO Navigator
            </span>
            <span className="text-[10px] text-slate-500 leading-tight truncate">
              Fast full-screen standalone app
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onInstall}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={onDismiss}
            title="Dismiss installation banner"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
