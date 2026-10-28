import React, { useState, useEffect, useRef } from 'react'
import { Award, ChevronRight, Compass } from 'lucide-react'

interface IntroScreenProps {
  onFinish?: () => void
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Auto-dismiss after exactly 2.0 seconds
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 1700)

    const dismissTimer = setTimeout(() => {
      setIsDismissed(true)
      onFinish?.()
    }, 2000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(dismissTimer)
    }
  }, [onFinish])

  // Golden stardust floating particles canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Generate golden stardust embers
    const particleCount = Math.min(width < 768 ? 25 : 45, 50)
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.6 + 0.25,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.y -= p.speedY
        p.x += p.speedX
        p.pulse += 0.03
        const currentOpacity = Math.max(0.1, p.opacity + Math.sin(p.pulse) * 0.2)

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 197, 66, ${currentOpacity})`
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(245, 197, 66, 0.8)'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleSkip = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      setIsDismissed(true)
      onFinish?.()
    }, 300)
  }

  if (isDismissed) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-slate-950 transition-all duration-600 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse 90% 80% at 50% 40%, #0d1b3e 0%, #060b18 55%, #020409 100%)',
      }}
    >
      {/* Background Interactive Stardust Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* Ambient Central Golden Spotlight */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 70%)',
          filter: 'blur(40px)',
          animationDuration: '3.5s',
        }}
      />

      {/* Top Action Bar with Skip Button */}
      <div className="absolute top-4 right-4 z-20 animate-fade-in">
        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel-dark text-amber-200/90 hover:text-white border border-amber-400/30 hover:border-amber-400/60 text-xs font-semibold tracking-wider transition-all shadow-lg active:scale-95 group"
        >
          <span>Skip Intro</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Content Showcase */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-xl px-5 text-center">
        
        {/* App Super-Title Above College Emblem */}
        <div className="mb-3 sm:mb-4 flex flex-col items-center gap-1 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-900/70 via-indigo-900/50 to-blue-900/70 border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)] backdrop-blur-md">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-blue-300 font-sans drop-shadow-sm">
              INFO CAMPUS NAVIGATION
            </span>
          </div>
        </div>

        {/* 1. Royal Medallion & Authentic College Emblem */}
        <div className="relative mb-5 flex items-center justify-center animate-slide-down">
          {/* Outer Pulsing Golden Ring */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-300/40 to-blue-500/30 blur-md opacity-75 animate-pulse" />
          
          {/* Prestigious Royal Medallion Disc */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-slate-900 via-[#0c1833] to-slate-950 p-3 shadow-2xl border-2 border-amber-400/70 flex items-center justify-center ring-4 ring-amber-500/20">
            {/* Inner Gold Halo Accent */}
            <div className="absolute inset-1 rounded-full border border-amber-300/30 pointer-events-none" />
            
            {/* High-Resolution Transparent College Emblem */}
            <img
              src="/images/college-emblem.png"
              alt="INFO Institute of Engineering Emblem"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform transform hover:scale-105"
            />
          </div>

          {/* Golden Royal Laurel Badge */}
          <div className="absolute -top-3.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 text-[9px] font-black tracking-widest uppercase shadow-md flex items-center gap-1 border border-yellow-200/80">
            <Award className="w-2.5 h-2.5" />
            <span>ESTD 2007</span>
          </div>
        </div>

        {/* 2. Majestic Institution Title */}
        <div className="flex flex-col items-center gap-1.5 animate-slide-up">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider uppercase font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
            INFO INSTITUTE OF ENGINEERING
          </h1>

          {/* Autonomous Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/50 text-amber-300 font-bold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <span>Autonomous Institution</span>
          </div>
        </div>

        {/* 3. Expanding Golden Filament Divider with Center Jewel */}
        <div className="w-full max-w-sm flex items-center justify-center my-4 opacity-90">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/70 to-amber-200" />
          <div className="w-2 h-2 rotate-45 bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.9)] mx-2 shrink-0" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400/70 to-amber-200" />
        </div>

        {/* 4. Accreditation & Affiliation Credentials */}
        <div className="flex flex-col items-center gap-1 text-[11px] sm:text-xs text-slate-300/90 font-medium leading-relaxed max-w-md animate-fade-in">
          <p className="tracking-wide">
            Approved by <span className="text-amber-200 font-semibold">AICTE, New Delhi</span> &amp; Affiliated to <span className="text-amber-200 font-semibold">Anna University, Chennai</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center text-[10px] sm:text-[10.5px] text-slate-400 pt-0.5">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-200 font-medium">
              Accredited by NAAC
            </span>
            <span className="text-amber-400">•</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-200 font-medium">
              ISO 9001:2015 Certified
            </span>
          </div>
          <p className="text-[10px] text-slate-400/80 pt-1 tracking-wide">
            N.H.209, Sathy Road, Kovilpalayam, Coimbatore - 641107
          </p>
        </div>

        {/* 6. Elegant Golden Progress Line */}
        <div className="w-48 sm:w-60 h-1 bg-slate-800/80 rounded-full mt-6 overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 rounded-full"
            style={{
              animation: 'introProgress 1.7s linear forwards',
            }}
          />
        </div>
      </div>

      {/* 7. DEVELOPED BY Signature Card (Executive Micro-Card - Apple/Linear Style) */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 z-30 animate-executive-card">
        <div className="relative flex items-stretch rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.55)] overflow-hidden">
          {/* Subtle Gold Hairline Accent Bar on Left Edge */}
          <div className="w-[3px] bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500 shrink-0" />

          {/* Content */}
          <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 flex flex-col gap-1 text-right">
            {/* Header */}
            <div className="flex items-center justify-end gap-1.5 pb-0.5 border-b border-white/5">
              <span className="w-1 h-1 rounded-full bg-amber-400/90 shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
              <span className="text-[9px] font-black tracking-[0.22em] text-amber-300/90 uppercase font-mono">
                DEVELOPED BY
              </span>
            </div>

            {/* Developer 1: Sivanesh R */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs sm:text-[13px] font-bold text-white tracking-wide font-sans">
                Sivanesh R
              </span>
              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30 uppercase tracking-wider font-mono">
                Tech Lead
              </span>
            </div>

            {/* Developer 2: Dinesh Kumar M M */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs sm:text-[13px] font-bold text-slate-200 tracking-wide font-sans">
                Dinesh Kumar M M
              </span>
              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-400/30 uppercase tracking-wider font-mono">
                Coordinator
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
