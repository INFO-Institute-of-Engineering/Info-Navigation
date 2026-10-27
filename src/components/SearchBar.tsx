import React, { useState, useRef, useEffect } from 'react'
import type { CampusLocation, CampusCategory } from '../types/campus'
import type { Coordinates } from '../types/navigation'
import { Search, X, MapPin, Navigation, Crosshair } from 'lucide-react'
import { CategoryFilterChips } from './CategoryFilterChips'
import { calculateHaversineDistance, formatDistance } from '../utils/distance'

interface SearchBarProps {
  locations: CampusLocation[]
  selectedDestination: CampusLocation | null
  onSelectDestination: (dest: CampusLocation) => void
  userCoords: Coordinates | null
  onRequestLocation: () => void
  gpsLoading: boolean
  selectedCategory: CampusCategory | 'all'
  onSelectCategory: (cat: CampusCategory | 'all') => void
}

export const SearchBar: React.FC<SearchBarProps> = ({
  locations,
  selectedDestination,
  onSelectDestination,
  userCoords,
  onRequestLocation,
  gpsLoading,
  selectedCategory,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter locations based on query and selected category
  const filteredLocations = locations.filter((loc) => {
    const matchesCategory =
      selectedCategory === 'all' || loc.category === selectedCategory

    if (!matchesCategory) return false

    if (!query.trim()) return true

    const q = query.toLowerCase()
    const matchesName = loc.name.toLowerCase().includes(q)
    const matchesDesc = loc.description.toLowerCase().includes(q)
    const matchesCode = loc.buildingInfo?.code?.toLowerCase().includes(q)
    const matchesKeywords = loc.keywords?.some((k) => k.toLowerCase().includes(q))

    return matchesName || matchesDesc || matchesCode || matchesKeywords
  })

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute top-3 left-3 right-3 md:left-4 md:right-auto md:w-96 z-40 flex flex-col gap-2"
    >
      {/* Top Main Search Bar */}
      <div className="glass-panel rounded-2xl shadow-google border border-white/60 p-1.5 flex flex-col transition-all">
        {/* College branding header */}
        <div className="flex items-center justify-between px-2.5 py-1 text-slate-800 border-b border-slate-100/80 mb-1">
          <div className="flex items-center gap-2">
            <img
              src="/images/info-logo.png"
              alt="INFO Institute"
              className="w-5 h-5 object-contain rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold tracking-wide text-blue-900 leading-tight">
                INFO INSTITUTE OF ENGINEERING
              </span>
              <span className="text-[9px] font-medium text-slate-500 leading-tight">
                Coimbatore • Live Campus Navigation
              </span>
            </div>
          </div>

          {/* Genuine Hardware GPS Button */}
          <button
            onClick={onRequestLocation}
            disabled={gpsLoading}
            title={
              userCoords
                ? `Hardware GPS Active (Accuracy: ±${Math.round(userCoords.accuracy || 5)}m)`
                : 'Click to acquire device GPS location'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-sm active:scale-95 ${
              userCoords
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Crosshair className={`w-3 h-3 ${gpsLoading ? 'animate-spin text-amber-300' : ''}`} />
            <span>
              {gpsLoading
                ? 'Locating...'
                : userCoords
                ? `GPS Active (±${Math.round(userCoords.accuracy || 5)}m)`
                : 'My Location'}
            </span>
          </button>
        </div>

        {/* Input Field */}
        <div className="flex items-center px-2 py-1 gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search academic blocks, labs, hostel..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setIsOpen(false)
              }}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <CategoryFilterChips
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="glass-panel rounded-2xl shadow-2xl border border-white/80 max-h-80 overflow-y-auto p-1.5 flex flex-col gap-1 z-50 animate-fade-in">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => {
              const distanceMeters = userCoords
                ? calculateHaversineDistance(
                    { latitude: userCoords.latitude, longitude: userCoords.longitude },
                    { latitude: loc.latitude, longitude: loc.longitude }
                  )
                : null

              const isSelected = selectedDestination?.id === loc.id

              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectDestination(loc)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/90 border border-blue-200'
                      : 'hover:bg-slate-50/90 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                      style={{
                        backgroundColor: `${loc.color || '#3b82f6'}15`,
                        color: loc.color || '#3b82f6',
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {loc.name}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {loc.description}
                      </span>
                      {loc.buildingInfo?.code && (
                        <span className="text-[9px] font-mono text-blue-600 font-semibold mt-0.5">
                          {loc.buildingInfo.code}
                        </span>
                      )}
                    </div>
                  </div>

                  {distanceMeters !== null && (
                    <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap shrink-0 mt-1 bg-slate-100/80 px-1.5 py-0.5 rounded">
                      {formatDistance(distanceMeters)}
                    </span>
                  )}
                </button>
              )
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No campus destination matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
