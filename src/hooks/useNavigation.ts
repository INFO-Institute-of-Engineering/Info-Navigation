import { useState, useEffect, useCallback, useRef } from 'react'
import type { CampusLocation } from '../types/campus'
import type { Coordinates, WalkingRoute, NavigationProgress } from '../types/navigation'
import { RoutingService, PEDESTRIAN_SPEED_MPS } from '../services/routingService'
import { calculateHaversineDistance } from '../utils/distance'
import { CAMPUS_CENTER } from '../data/campusBoundary'

export function useNavigation(userCoords: Coordinates | null) {
  const [selectedDestination, setSelectedDestination] = useState<CampusLocation | null>(null)
  const [currentRoute, setCurrentRoute] = useState<WalkingRoute | null>(null)
  const [progress, setProgress] = useState<NavigationProgress>({
    isActive: false,
    currentRoute: null,
    destination: null,
    currentStepIndex: 0,
    remainingDistanceMeters: 0,
    remainingDurationSeconds: 0,
    progressPercentage: 0,
    isOffRoute: false,
    isRerouting: false,
    hasArrived: false,
  })

  const lastRerouteTimeRef = useRef<number>(0)

  // Compute route when a destination is selected or when starting navigation
  const computeRoute = useCallback(
    (destination: CampusLocation, startLocation?: Coordinates | null): WalkingRoute | null => {
      // Determine effective start coordinates:
      // If user is inside campus, navigate from their live position; otherwise start at the Main Entrance Gate
      let start: Coordinates = startLocation || userCoords || {
        latitude: 11.128134,
        longitude: 77.039350,
      }

      if (start) {
        const distFromCenter = calculateHaversineDistance(start, {
          latitude: CAMPUS_CENTER[0],
          longitude: CAMPUS_CENTER[1],
        })
        if (distFromCenter > 380) {
          // User is outside the college area: start walking route at Main Entrance Gate
          start = {
            latitude: 11.128134,
            longitude: 77.039350,
          }
        }
      }

      const route = RoutingService.calculateWalkingRoute(start, destination)
      if (route) {
        setCurrentRoute(route)
        setProgress((prev) => ({
          ...prev,
          currentRoute: route,
          destination,
          remainingDistanceMeters: route.totalDistanceMeters,
          remainingDurationSeconds: route.estimatedDurationSeconds,
          currentStepIndex: 0,
          progressPercentage: 0,
          hasArrived: false,
          isOffRoute: false,
        }))
      }
      return route
    },
    [userCoords]
  )

  const selectDestination = useCallback(
    (destination: CampusLocation | null) => {
      setSelectedDestination(destination)
      if (destination) {
        computeRoute(destination)
      } else {
        setCurrentRoute(null)
        setProgress((prev) => ({
          ...prev,
          isActive: false,
          currentRoute: null,
          destination: null,
          hasArrived: false,
        }))
      }
    },
    [computeRoute]
  )

  const startNavigation = useCallback(() => {
    if (!selectedDestination) return

    const route = computeRoute(selectedDestination)

    setProgress((prev) => ({
      ...prev,
      isActive: true,
      currentRoute: route || prev.currentRoute,
      destination: selectedDestination,
      currentStepIndex: 0,
      hasArrived: false,
      isOffRoute: false,
    }))
  }, [selectedDestination, userCoords, computeRoute])

  const stopNavigation = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      isActive: false,
      hasArrived: false,
      isOffRoute: false,
      isRerouting: false,
    }))
  }, [])

  // Live route tracking and update when user coordinates change
  useEffect(() => {
    if (!progress.isActive || !currentRoute || !userCoords || !selectedDestination) return

    const destLat = selectedDestination.entranceLatitude ?? selectedDestination.latitude
    const destLng = selectedDestination.entranceLongitude ?? selectedDestination.longitude

    // 1. Check if user arrived at the destination entrance (within 10m)
    const distToDestination = calculateHaversineDistance(userCoords, {
      latitude: destLat,
      longitude: destLng,
    })

    if (distToDestination <= 10) {
      setProgress((prev) => ({
        ...prev,
        hasArrived: true,
        remainingDistanceMeters: 0,
        remainingDurationSeconds: 0,
        progressPercentage: 100,
        currentStepIndex: currentRoute.steps.length - 1,
      }))
      return
    }

    // 2. Check route deviation (threshold = 25m)
    const deviation = RoutingService.checkRouteDeviation(userCoords, currentRoute, 25)

    if (deviation.isOffRoute) {
      const now = Date.now()
      // Throttle rerouting to once every 4 seconds to prevent thrashing
      if (now - lastRerouteTimeRef.current > 4000) {
        lastRerouteTimeRef.current = now
        setProgress((prev) => ({ ...prev, isOffRoute: true, isRerouting: true }))

        // Recalculate walking route from current live GPS
        const newRoute = RoutingService.calculateWalkingRoute(userCoords, selectedDestination)
        if (newRoute) {
          setCurrentRoute(newRoute)
          setProgress((prev) => ({
            ...prev,
            currentRoute: newRoute,
            remainingDistanceMeters: newRoute.totalDistanceMeters,
            remainingDurationSeconds: newRoute.estimatedDurationSeconds,
            isOffRoute: false,
            isRerouting: false,
            currentStepIndex: 0,
          }))
        } else {
          setProgress((prev) => ({ ...prev, isRerouting: false }))
        }
      }
      return
    }

    // 3. User is on track — advance step index and recalculate remaining distance
    // Find closest step
    let closestStepIdx = progress.currentStepIndex
    let minStepDist = Infinity

    currentRoute.steps.forEach((step, idx) => {
      const d = calculateHaversineDistance(userCoords, step.coordinate)
      if (d < minStepDist) {
        minStepDist = d
        closestStepIdx = idx
      }
    })

    // Calculate remaining distance from user location along the rest of the path
    let remainingDist = distToDestination
    const durationSec = Math.round(remainingDist / PEDESTRIAN_SPEED_MPS)
    const totalDist = currentRoute.totalDistanceMeters || 1
    const completedDist = Math.max(0, totalDist - remainingDist)
    const progressPct = Math.min(100, Math.round((completedDist / totalDist) * 100))

    setProgress((prev) => ({
      ...prev,
      currentStepIndex: closestStepIdx,
      remainingDistanceMeters: remainingDist,
      remainingDurationSeconds: durationSec,
      progressPercentage: progressPct,
      isOffRoute: false,
      isRerouting: false,
    }))
  }, [userCoords, progress.isActive, currentRoute, selectedDestination])

  return {
    selectedDestination,
    currentRoute,
    progress,
    selectDestination,
    startNavigation,
    stopNavigation,
    computeRoute,
  }
}
