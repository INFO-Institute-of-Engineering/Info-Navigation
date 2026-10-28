import React, { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'
import { MapView } from '../components/MapView'
import { SearchBar } from '../components/SearchBar'
import { DestinationCard } from '../components/DestinationCard'
import { NavigationPanel } from '../components/NavigationPanel'
import { MapControls } from '../components/MapControls'
import { OutdoorAlertBanner } from '../components/OutdoorAlertBanner'
import { QrShareModal } from '../components/QrShareModal'
import { IntroScreen } from '../components/IntroScreen'
import { InstallBanner } from '../components/InstallBanner'
import { InstallPromptModal } from '../components/InstallPromptModal'

import { getStoredCampusLocations } from '../data/campusLocations'
import { CAMPUS_CENTER, DEFAULT_ZOOM } from '../data/campusBoundary'
import { useGeolocation } from '../hooks/useGeolocation'
import { useNavigation } from '../hooks/useNavigation'
import { usePWA } from '../hooks/usePWA'
import type { CampusLocation, CampusCategory } from '../types/campus'

export const HomePage: React.FC = () => {
  const [locations] = useState<CampusLocation[]>(() => getStoredCampusLocations())
  const [isSatellite, setIsSatellite] = useState<boolean>(true)
  const [isTilted, setIsTilted] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<CampusCategory | 'all'>('all')
  const [isQrShareOpen, setIsQrShareOpen] = useState<boolean>(false)
  const [showIntro, setShowIntro] = useState<boolean>(true)

  // PWA installability & service worker management
  const {
    canInstall,
    isInstalled,
    showIosInstructions,
    promptInstall,
    dismissBanner,
    closeIosModal,
  } = usePWA()

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
    activeUserCoords,
    selectDestination,
    startNavigation,
    stopNavigation,
    startSimulation,
    stopSimulation,
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

  // Automatically trigger location prompt on website entry (like Google Maps)
  useEffect(() => {
    requestLocation()
  }, [requestLocation])

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

  // Start walking navigation with Google Maps style camera focus
  const handleStartNavigation = useCallback(() => {
    startNavigation()
    if (currentRoute && currentRoute.pathCoordinates.length > 0 && mapRef.current) {
      const start = currentRoute.pathCoordinates[0]
      mapRef.current.setView([start[0], start[1]], 19, {
        animate: true,
        duration: 0.8,
      })
    }
  }, [startNavigation, currentRoute])

  // Google Maps style camera auto-following during active walking navigation
  useEffect(() => {
    if (progress.isActive && activeUserCoords && mapRef.current) {
      mapRef.current.panTo([activeUserCoords.latitude, activeUserCoords.longitude], {
        animate: true,
        duration: 0.6,
      })
    }
  }, [progress.isActive, activeUserCoords])

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Central Satellite Map Canvas */}
      <MapView
        locations={locations}
        selectedDestination={selectedDestination}
        onSelectDestination={handleSelectDestination}
        userCoords={activeUserCoords}
        currentRoute={currentRoute}
        isSatellite={isSatellite}
        isTilted={isTilted}
        mapRefOut={mapRef}
      />

      {/* Top Unified Google Maps Header Stack (Search + Categories + Alert Banner) */}
      {!progress.isActive && (
        <div className="absolute top-2.5 left-2.5 right-2.5 md:top-3 md:left-4 md:right-auto md:w-[410px] z-40 flex flex-col gap-1.5 pointer-events-none">
          <div className="pointer-events-auto">
            <SearchBar
              locations={locations}
              selectedDestination={selectedDestination}
              onSelectDestination={handleSelectDestination}
              userCoords={activeUserCoords}
              onRequestLocation={requestLocation}
              gpsLoading={gpsLoading}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="pointer-events-auto">
            <OutdoorAlertBanner
              userCoords={userCoords}
              isInsideCampus={isInsideCampus}
              isLoading={gpsLoading}
              error={gpsError}
              onRequestLocation={requestLocation}
              onCenterCampus={handleCampusOverview}
              onRecenterGps={handleRecenterGps}
            />
          </div>
        </div>
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
        canInstall={canInstall}
        isInstalled={isInstalled}
        onPromptInstall={promptInstall}
      />

      {/* Selected Destination Details Sheet */}
      {selectedDestination && !progress.isActive && (
        <DestinationCard
          destination={selectedDestination}
          currentRoute={currentRoute}
          onStartNavigation={handleStartNavigation}
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
          onStartSimulation={startSimulation}
          onStopSimulation={stopSimulation}
        />
      )}

      {/* Mobile QR Share Modal */}
      <QrShareModal
        isOpen={isQrShareOpen}
        onClose={() => setIsQrShareOpen(false)}
        destination={selectedDestination}
        userCoords={userCoords}
      />

      {/* Optional Install App Banner (Unobtrusive, dismissible for session) */}
      {!progress.isActive && (
        <InstallBanner
          canInstall={canInstall}
          isInstalled={isInstalled}
          onInstall={promptInstall}
          onDismiss={dismissBanner}
        />
      )}

      {/* iOS Safari Home Screen Add Instructions Modal */}
      <InstallPromptModal
        isOpen={showIosInstructions}
        onClose={closeIosModal}
      />

      {/* 3-Second Cinematic College Intro Screen (Option 2: Golden Prestige & Royal Academy) */}
      {showIntro && (
        <IntroScreen onFinish={() => setShowIntro(false)} />
      )}
    </div>
  )
}
