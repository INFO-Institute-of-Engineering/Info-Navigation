import React, { useEffect, useState } from 'react'
import type { CampusLocation } from '../types/campus'
import type { Coordinates } from '../types/navigation'
import { QrService } from '../services/qrService'
import { X, Smartphone, Copy, Check, Share2 } from 'lucide-react'

interface QrShareModalProps {
  isOpen: boolean
  onClose: () => void
  destination: CampusLocation | null
  userCoords: Coordinates | null
}

export const QrShareModal: React.FC<QrShareModalProps> = ({
  isOpen,
  onClose,
  destination,
  userCoords,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const destId = destination?.id || 'main-entrance'
    QrService.generateRouteQrCode(destId, userCoords).then((url) => {
      setQrDataUrl(url)
    })
  }, [isOpen, destination, userCoords])

  if (!isOpen) return null

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?destination=${encodeURIComponent(destination?.id || 'main-entrance')}`
    : ''

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-4 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-extrabold text-slate-900">
            Open on Mobile GPS
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Scan with your phone camera to start live walking navigation to{' '}
            <span className="font-bold text-slate-800">
              {destination?.name || 'INFO Institute of Engineering'}
            </span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-inner flex items-center justify-center min-w-[200px] min-h-[200px]">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Campus Navigation QR Code" className="w-52 h-52 object-contain" />
          ) : (
            <div className="text-xs text-slate-400 animate-pulse">Generating QR code...</div>
          )}
        </div>

        {/* Copy Link Button */}
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-slate-100 px-3 py-2 text-xs font-mono text-slate-600 rounded-xl border border-slate-200 truncate focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
