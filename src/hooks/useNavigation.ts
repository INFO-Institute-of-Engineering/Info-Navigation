import { useState, useEffect, useCallback, useRef } from 'react'
import type { CampusLocation } from '../types/campus'
import type { Coordinates, WalkingRoute, NavigationProgress } from '../types/navigation'
import { RoutingService, PEDESTRIAN_SPEED_MPS } from '../services/routingService'
import { calculateHaversineDistance } from '../utils/distance'
import { playArrivalChime } from '../utils/audio'
import { CAMPUS_CENTER } from '../data/campusBoundary'

function calculateBearing(start: Coordinates, end: Coordinates): number {
  const startLat = (start.latitude * Math.PI) / 180
  const startLng = (start.longitude * Math.PI) / 180
  const endLat = (end.latitude * Math.PI) / 180
  const endLng = (end.longitude * Math.PI) / 180

  const dLng = endLng - startLng
  const y = Math.sin(dLng) * Math.cos(endLat)
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng)
  const brng = Math.atan2(y, x)
  return ((brng * 180) / Math.PI + 360) % 360
}

export function useNavigation(userCoords: Coordinates | null) {
  const [selectedDestination, setSelectedDestination] = useState<CampusLocation | null>(null)
  const [currentRoute, setCurrentRoute] = useState<WalkingRoute | null>(null)
  const [simulatedCoords, setSimulatedCoords] = useState<Coordinates | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const simulationTimerRef = useRef<number | null>(null)
  const hasPlayedChimeRef = useRef(false)

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
    isSimulating: false,
  })

  const lastRerouteTimeRef = useRef<number>(0)

  // Effective coords used for map display and navigation calculation
  const activeUserCoords: Coordinates | null = isSimulating && simulatedCoords ? simulatedCoords : userCoords

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
          isSimulating: false,
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
        setSimulatedCoords(null)
        setIsSimulating(false)
        if (simulationTimerRef.current) {
          window.clearInterval(simulationTimerRef.current)
          simulationTimerRef.current = null
        }
        setProgress((prev) => ({
          ...prev,
          isActive: false,
          currentRoute: null,
          destination: null,
          hasArrived: false,
          isSimulating: false,
        }))
      }
    },
    [computeRoute]
  )

  const stopSimulation = useCallback(() => {
    if (simulationTimerRef.current) {
      window.clearInterval(simulationTimerRef.current)
      simulationTimerRef.current = null
    }
    setIsSimulating(false)
    setSimulatedCoords(null)
    setProgress((prev) => ({ ...prev, isSimulating: false }))
  }, [])

  const startSimulation = useCallback((speedMultiplier: number = 1.5) => {
    if (!currentRoute || currentRoute.pathCoordinates.length < 2) return

    if (simulationTimerRef.current) {
      window.clearInterval(simulationTimerRef.current)
      simulationTimerRef.current = null
    }

    setIsSimulating(true)
    hasPlayedChimeRef.current = false

    // Flatten route into smooth granular interpolated steps (approx 3m per frame)
    const points: Array<{ lat: number; lng: number; heading: number }> = []
    const rawCoords = currentRoute.pathCoordinates

    for (let i = 0; i < rawCoords.length - 1; i++) {
      const p1 = { latitude: rawCoords[i][0], longitude: rawCoords[i][1] }
      const p2 = { latitude: rawCoords[i + 1][0], longitude: rawCoords[i + 1][1] }
      const dist = calculateHaversineDistance(p1, p2)
      const numSteps = Math.max(1, Math.round(dist / 3.0))
      const heading = calculateBearing(p1, p2)

      for (let s = 0; s < numSteps; s++) {
        const factor = s / numSteps
        points.push({
          lat: p1.latitude + (p2.latitude - p1.latitude) * factor,
          lng: p1.longitude + (p2.longitude - p1.longitude) * factor,
          heading,
        })
      }
    }

    // Add final destination coordinate
    const last = rawCoords[rawCoords.length - 1]
    const secondLast = rawCoords[rawCoords.length - 2]
    points.push({
      lat: last[0],
      lng: last[1],
      heading: calculateBearing(
        { latitude: secondLast[0], longitude: secondLast[1] },
        { latitude: last[0], longitude: last[1] }
      ),
    })

    let currentIndex = 0

    // Set initial position
    const firstPoint = points[0]
    setSimulatedCoords({
      latitude: firstPoint.lat,
      longitude: firstPoint.lng,
      accuracy: 3,
      heading: firstPoint.heading,
      speed: 1.5 * speedMultiplier,
    })

    setProgress((prev) => ({ ...prev, isSimulating: true, hasArrived: false }))

    // Advance point smoothly every interval
    const intervalMs = Math.max(250, Math.round(650 / speedMultiplier))

    const timer = window.setInterval(() => {
      currentIndex++
      if (currentIndex >= points.length) {
        if (simulationTimerRef.current) {
          window.clearInterval(simulationTimerRef.current)
          simulationTimerRef.current = null
        }
        setIsSimulating(false)
        return
      }

      const p = points[currentIndex]
      setSimulatedCoords({
        latitude: p.lat,
        longitude: p.lng,
        accuracy: 3,
        heading: p.heading,
        speed: 1.5 * speedMultiplier,
      })
    }, intervalMs)

    simulationTimerRef.current = timer
  }, [currentRoute])

  const startNavigation = useCallback(() => {
    if (!selectedDestination) return

    const route = computeRoute(selectedDestination)
    hasPlayedChimeRef.current = false

    setProgress((prev) => ({
      ...prev,
      isActive: true,
      currentRoute: route || prev.currentRoute,
      destination: selectedDestination,
      currentStepIndex: 0,
      hasArrived: false,
      isOffRoute: false,
      isSimulating: false,
    }))
  }, [selectedDestination, computeRoute])

  const stopNavigation = useCallback(() => {
    stopSimulation()
    hasPlayedChimeRef.current = false
    setProgress((prev) => ({
      ...prev,
      isActive: false,
      hasArrived: false,
      isOffRoute: false,
      isRerouting: false,
      isSimulating: false,
    }))
  }, [stopSimulation])

  // Live route tracking and remaining distance updates
  useEffect(() => {
    if (!progress.isActive || !currentRoute || !activeUserCoords || !selectedDestination) return

    const destLat = selectedDestination.entranceLatitude ?? selectedDestination.latitude
    const destLng = selectedDestination.entranceLongitude ?? selectedDestination.longitude

    // Straight-line distance to destination entrance
    const distToDestination = calculateHaversineDistance(activeUserCoords, {
      latitude: destLat,
      longitude: destLng,
    })

    // 1. Arrival Detection: trigger when user is near approximately (~18 meters)
    const arrivalThreshold = 18

    if (distToDestination <= arrivalThreshold) {
      if (!hasPlayedChimeRef.current) {
        hasPlayedChimeRef.current = true
        playArrivalChime()
      }

      if (simulationTimerRef.current) {
        window.clearInterval(simulationTimerRef.current)
        simulationTimerRef.current = null
      }

      setProgress((prev) => ({
        ...prev,
        hasArrived: true,
        remainingDistanceMeters: 0,
        remainingDurationSeconds: 0,
        progressPercentage: 100,
        currentStepIndex: currentRoute.steps.length - 1,
        isSimulating: false,
      }))
      return
    }

    // 2. Check route deviation (threshold = 25m) only for physical GPS walking
    if (!isSimulating) {
      const deviation = RoutingService.checkRouteDeviation(activeUserCoords, currentRoute, 25)

      if (deviation.isOffRoute) {
        const now = Date.now()
        // Throttle rerouting to once every 4 seconds to prevent thrashing
        if (now - lastRerouteTimeRef.current > 4000) {
          lastRerouteTimeRef.current = now
          setProgress((prev) => ({ ...prev, isOffRoute: true, isRerouting: true }))

          // Recalculate walking route from current live GPS
          const newRoute = RoutingService.calculateWalkingRoute(activeUserCoords, selectedDestination)
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
    }

    // 3. User is moving along path — advance step index and calculate accurate remaining distance
    let closestStepIdx = progress.currentStepIndex
    let minStepDist = Infinity

    currentRoute.steps.forEach((step, idx) => {
      const d = calculateHaversineDistance(activeUserCoords, step.coordinate)
      if (d < minStepDist) {
        minStepDist = d
        closestStepIdx = idx
      }
    })

    // Find closest segment on pathCoordinates
    let closestCoordIdx = 0
    let minCoordDist = Infinity

    currentRoute.pathCoordinates.forEach((coord, idx) => {
      const d = calculateHaversineDistance(activeUserCoords, {
        latitude: coord[0],
        longitude: coord[1],
      })
      if (d < minCoordDist) {
        minCoordDist = d
        closestCoordIdx = idx
      }
    })

    // Sum remaining segment distances along pathCoordinates to the destination
    let remainingPathDist = minCoordDist
    for (let i = closestCoordIdx; i < currentRoute.pathCoordinates.length - 1; i++) {
      const p1 = currentRoute.pathCoordinates[i]
      const p2 = currentRoute.pathCoordinates[i + 1]
      remainingPathDist += calculateHaversineDistance(
        { latitude: p1[0], longitude: p1[1] },
        { latitude: p2[0], longitude: p2[1] }
      )
    }

    // Use minimum of remaining path distance or straight-line distance, but not less than 1m
    let remainingDist = Math.min(remainingPathDist, Math.max(distToDestination, 1))
    remainingDist = Math.max(1, Math.round(remainingDist))

    const durationSec = Math.max(1, Math.round(remainingDist / PEDESTRIAN_SPEED_MPS))
    const totalDist = currentRoute.totalDistanceMeters || 1
    const completedDist = Math.max(0, totalDist - remainingDist)
    const progressPct = Math.min(99, Math.round((completedDist / totalDist) * 100))

    setProgress((prev) => ({
      ...prev,
      currentStepIndex: closestStepIdx,
      remainingDistanceMeters: remainingDist,
      remainingDurationSeconds: durationSec,
      progressPercentage: progressPct,
      isOffRoute: false,
      isRerouting: false,
      isSimulating,
    }))
  }, [activeUserCoords, progress.isActive, currentRoute, selectedDestination, isSimulating])

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) {
        window.clearInterval(simulationTimerRef.current)
      }
    }
  }, [])

  return {
    selectedDestination,
    currentRoute,
    progress,
    activeUserCoords,
    selectDestination,
    startNavigation,
    stopNavigation,
    startSimulation,
    stopSimulation,
    computeRoute,
  }
}
