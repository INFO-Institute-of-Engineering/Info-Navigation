import React, { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import { MapView } from '../components/MapView'
import { SearchBar } from '../components/SearchBar'
import { DestinationCard } from '../components/DestinationCard'
import { NavigationPanel } from '../components/NavigationPanel'
import { MapControls } from '../components/MapControls'
import { OutdoorAlertBanner } from '../components/OutdoorAlertBanner'
import { QrShareModal } from '../components/QrShareModal'

import { getStoredCampusLocations } from '../data/campusLocations'
import { CAMPUS_CENTER, DEFAULT_ZOOM } from '../data/campusBoundary'
import { useGeolocation } from '../hooks/useGeolocation'
import { useNavigation } from '../hooks/useNavigation'
import type { CampusLocation, CampusCategory } from '../types/campus'

export const HomePage: React.FC = () => {
  const [locations] = useState<CampusLocation[]>(() => getStoredCampusLocations())
  const [isSatellite, setIsSatellite] = useState<boolean>(true)
  const [isTilted, setIsTilted] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<CampusCategory | 'all'>('all')
  const [isQrShareOpen, setIsQrShareOpen] = useState<boolean>(false)

  const mapRef = useRef<L.Map | null>(null)

  // 1. Live Geolocation hook (pure browser hardware GPS)
  const {
    coords: userCoords,
    isLoading: gpsLoading,
    error: gpsError,
    isInsideCampus,
    requestLocation,
  } = useGeolocation(true)

  // 2. Campus Walking Navigation hook
  const {
    selectedDestination,
    currentRoute,
    progress,
    selectDestination,
    startNavigation,
    stopNavigation,
  } = useNavigation(userCoords)

  // 3. Handle URL parameters (e.g. ?destination=b-block)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const destId = params.get('destination')
    const startNav = params.get('nav') === 'true'

    if (destId) {
      const match = locations.find((l) => l.id.toLowerCase() === destId.toLowerCase())
      if (match) {
        selectDestination(match)
        if (startNav) {
          setTimeout(() => startNavigation(), 500)
        }
      }
    }
  }, [locations, selectDestination, startNavigation])

  // Center on college campus overview
  const handleCampusOverview = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(CAMPUS_CENTER, DEFAULT_ZOOM, {
        animate: true,
        duration: 0.8,
      })
    }
  }, [])

  // Recenter on user's real hardware GPS position wherever they are
  const handleRecenterGps = useCallback(async () => {
    let target = userCoords
    if (!target) {
      target = await requestLocation()
    }
    if (target && mapRef.current) {
      mapRef.current.setView([target.latitude, target.longitude], 18, {
        animate: true,
        duration: 0.8,
      })
    }
  }, [userCoords, requestLocation])

  // Pan to selected destination
  const handleSelectDestination = useCallback(
    (dest: CampusLocation) => {
      selectDestination(dest)
      if (mapRef.current) {
        mapRef.current.setView([dest.latitude, dest.longitude], 19, {
          animate: true,
          duration: 0.8,
        })
      }
    },
    [selectDestination]
  )

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Central Satellite Map Canvas */}
      <MapView
        locations={locations}
        selectedDestination={selectedDestination}
        onSelectDestination={handleSelectDestination}
        userCoords={userCoords}
        currentRoute={currentRoute}
        isSatellite={isSatellite}
        isTilted={isTilted}
        mapRefOut={mapRef}
      />

      {/* Top Search Bar (Hidden during active live navigation) */}
      {!progress.isActive && (
        <SearchBar
          locations={locations}
          selectedDestination={selectedDestination}
          onSelectDestination={handleSelectDestination}
          userCoords={userCoords}
          onRequestLocation={requestLocation}
          gpsLoading={gpsLoading}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* Floating Map Action Controls */}
      <MapControls
        isSatellite={isSatellite}
        onToggleSatellite={() => setIsSatellite((prev) => !prev)}
        isTilted={isTilted}
        onToggleTilt={() => setIsTilted((prev) => !prev)}
        onRecenterGps={handleRecenterGps}
        onCampusOverview={handleCampusOverview}
        onOpenQrShare={() => setIsQrShareOpen(true)}
        gpsLoading={gpsLoading}
        hasGps={Boolean(userCoords)}
      />

      {/* Outside Campus Geofence / Notice */}
      <OutdoorAlertBanner
        userCoords={userCoords}
        isInsideCampus={isInsideCampus}
        onCenterCampus={handleCampusOverview}
        onRecenterGps={handleRecenterGps}
      />

      {/* Selected Destination Details Sheet */}
      {selectedDestination && !progress.isActive && (
        <DestinationCard
          destination={selectedDestination}
          currentRoute={currentRoute}
          onStartNavigation={startNavigation}
          onClose={() => selectDestination(null)}
          onOpenQrShare={() => setIsQrShareOpen(true)}
          isNavigating={progress.isActive}
        />
      )}

      {/* Active Live Walking HUD */}
      {progress.isActive && (
        <NavigationPanel
          progress={progress}
          onStopNavigation={stopNavigation}
        />
      )}

      {/* Mobile QR Share Modal */}
      <QrShareModal
        isOpen={isQrShareOpen}
        onClose={() => setIsQrShareOpen(false)}
        destination={selectedDestination}
        userCoords={userCoords}
      />
    </div>
  )
}
