import React from 'react'
import { Share, PlusSquare, X, Smartphone, Check } from 'lucide-react'

interface InstallPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="glass-panel text-slate-900 rounded-3xl shadow-2xl border border-white/80 p-5 sm:p-6 max-w-sm w-full flex flex-col gap-4 animate-scale-up relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Close instructions"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 font-mono">
              INSTALL PWA APP
            </span>
            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
              Install on iPhone / iPad
            </h3>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="flex flex-col text-xs text-slate-700">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                Tap the Share button
                <Share className="w-3.5 h-3.5 text-blue-600 inline" />
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Located at the bottom of Safari (or top right on iPad).
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="flex flex-col text-xs text-slate-700">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                Tap "Add to Home Screen"
                <PlusSquare className="w-3.5 h-3.5 text-emerald-600 inline" />
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Scroll down in the share menu to find this option.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="flex flex-col text-xs text-slate-700">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                Tap "Add" in top-right
                <Check className="w-3.5 h-3.5 text-blue-600 inline" />
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                The app will appear on your Home Screen as an icon.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all text-center"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
