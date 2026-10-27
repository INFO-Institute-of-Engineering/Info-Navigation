import { useState, useEffect, useCallback, useRef } from 'react'
import type { Coordinates, GeolocationState } from '../types/navigation'
import { GeolocationService } from '../services/geolocationService'

export function useGeolocation(autoWatch: boolean = true) {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    isLoading: true,
    error: null,
    isSupported: GeolocationService.isSupported(),
    permissionStatus: 'unknown',
    isInsideCampus: false,
    isManual: false,
  })

  const stopWatchingRef = useRef<(() => void) | null>(null)

  // Clear legacy localStorage overrides
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('info_campus_manual_user_loc')
        localStorage.removeItem('info_campus_user_calibrated_coords_v1')
        localStorage.removeItem('info_campus_calibrated_coords')
      } catch {
        // ignore
      }
    }
  }, [])

  // Request fresh GPS position from hardware
  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const coords = await GeolocationService.getCurrentPosition()
      const isInside = GeolocationService.isInsideCampus(coords)
      setState((prev) => ({
        ...prev,
        coords,
        isLoading: false,
        error: null,
        permissionStatus: 'granted',
        isInsideCampus: isInside,
        isManual: false,
      }))
      return coords
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to acquire location.'
      const isDenied = errorMsg.toLowerCase().includes('denied')
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
        permissionStatus: isDenied ? 'denied' : prev.permissionStatus,
      }))
      return null
    }
  }, [])

  // Start continuous watching using browser watchPosition
  const startWatching = useCallback(() => {
    if (stopWatchingRef.current) {
      stopWatchingRef.current()
      stopWatchingRef.current = null
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    const cleanup = GeolocationService.startWatching(
      (coords: Coordinates) => {
        const isInside = GeolocationService.isInsideCampus(coords)
        setState((prev) => ({
          ...prev,
          coords,
          isLoading: false,
          error: null,
          permissionStatus: 'granted',
          isInsideCampus: isInside,
          isManual: false,
        }))
      },
      (errorMsg: string) => {
        const isDenied = errorMsg.toLowerCase().includes('denied')
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
          permissionStatus: isDenied ? 'denied' : prev.permissionStatus,
        }))
      }
    )

    stopWatchingRef.current = cleanup
  }, [])

  const stopWatching = useCallback(() => {
    if (stopWatchingRef.current) {
      stopWatchingRef.current()
      stopWatchingRef.current = null
    }
  }, [])

  useEffect(() => {
    if (autoWatch) {
      startWatching()
    }
    return () => {
      stopWatching()
    }
  }, [autoWatch, startWatching, stopWatching])

  return {
    ...state,
    requestLocation,
    startWatching,
    stopWatching,
  }
}
