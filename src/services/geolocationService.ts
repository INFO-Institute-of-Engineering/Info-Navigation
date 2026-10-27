import type { Coordinates } from '../types/navigation'
import { isPointInPolygon } from '../utils/distance'
import { CAMPUS_BOUNDARY_POLYGON } from '../data/campusBoundary'

export class GeolocationService {
  private static watchId: number | null = null

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'geolocation' in navigator
  }

  /**
   * Retrieves single high-accuracy zero-cache GPS position from device hardware.
   */
  public static getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported by your browser.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            altitude: pos.coords.altitude,
          })
        },
        (err) => {
          reject(new Error(this.getErrorMessage(err)))
        },
        {
          enableHighAccuracy: true,
          timeout: 25000,
          maximumAge: 0, // Zero cache: enforce fresh hardware GPS reading
        }
      )
    })
  }

  /**
   * Starts real-time continuous GPS tracking with zero cache.
   */
  public static startWatching(
    onSuccess: (coords: Coordinates) => void,
    onError: (errorMsg: string) => void
  ): () => void {
    if (!this.isSupported()) {
      onError('Geolocation is not supported by your browser.')
      return () => {}
    }

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        onSuccess({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          altitude: pos.coords.altitude,
        })
      },
      (err) => {
        onError(this.getErrorMessage(err))
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        maximumAge: 0, // Zero cache
      }
    )

    return () => {
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId)
        this.watchId = null
      }
    }
  }

  public static stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  public static isInsideCampus(coords: Coordinates): boolean {
    return isPointInPolygon(coords, CAMPUS_BOUNDARY_POLYGON)
  }

  private static getErrorMessage(err: GeolocationPositionError): string {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        return 'Location permission was denied. Please allow browser location access.'
      case err.POSITION_UNAVAILABLE:
        return 'GPS position unavailable. Please ensure device location is enabled.'
      case err.TIMEOUT:
        return 'GPS request timed out while acquiring satellite signals.'
      default:
        return err.message || 'An unknown geolocation error occurred.'
    }
  }
}
