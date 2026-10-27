import type { Coordinates } from '../types/navigation'

/**
 * Calculates Haversine distance in meters between two geographic coordinates.
 */
export function calculateHaversineDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const R = 6371000 // Earth radius in meters
  const lat1Rad = (coord1.latitude * Math.PI) / 180
  const lat2Rad = (coord2.latitude * Math.PI) / 180
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180
  const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

/**
 * Calculates compass bearing from point A to point B in degrees (0-360).
 */
export function calculateBearing(
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
): number {
  const lat1 = (start.latitude * Math.PI) / 180
  const lat2 = (end.latitude * Math.PI) / 180
  const dLon = ((end.longitude - start.longitude) * Math.PI) / 180

  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  const brng = (Math.atan2(y, x) * 180) / Math.PI

  return (brng + 360) % 360
}

/**
 * Generates turn-by-turn maneuver instruction from bearing change.
 */
export function getManeuverDirection(initialBearing: number, targetBearing: number): string {
  let diff = (targetBearing - initialBearing + 360) % 360
  if (diff > 180) diff -= 360

  if (Math.abs(diff) <= 25) return 'Continue straight'
  if (diff > 25 && diff <= 65) return 'Turn slight right'
  if (diff > 65 && diff <= 120) return 'Turn right'
  if (diff > 120) return 'Turn sharp right'
  if (diff < -25 && diff >= -65) return 'Turn slight left'
  if (diff < -65 && diff >= -120) return 'Turn left'
  return 'Turn sharp left'
}

/**
 * Calculates distance in meters from a point to a line segment.
 * Essential for precise pedestrian route deviation and off-track detection.
 */
export function distanceToSegment(
  point: { latitude: number; longitude: number },
  v: { latitude: number; longitude: number },
  w: { latitude: number; longitude: number }
): number {
  const l2 = Math.pow(w.latitude - v.latitude, 2) + Math.pow(w.longitude - v.longitude, 2)
  if (l2 === 0) return calculateHaversineDistance(point, v)

  let t =
    ((point.latitude - v.latitude) * (w.latitude - v.latitude) +
      (point.longitude - v.longitude) * (w.longitude - v.longitude)) /
    l2
  t = Math.max(0, Math.min(1, t))

  const projection = {
    latitude: v.latitude + t * (w.latitude - v.latitude),
    longitude: v.longitude + t * (w.longitude - v.longitude),
  }

  return calculateHaversineDistance(point, projection)
}

/**
 * Ray-casting algorithm to verify if GPS coordinates are inside a polygon.
 */
export function isPointInPolygon(
  point: { latitude: number; longitude: number },
  polygon: Array<[number, number]>
): boolean {
  const x = point.latitude
  const y = point.longitude
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]
    const yi = polygon[i][1]
    const xj = polygon[j][0]
    const yj = polygon[j][1]

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }

  return inside
}

/**
 * Formats distance for user display: e.g. "85 m", "1.2 km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Formats duration in seconds into human-readable walking time.
 * Standard pedestrian walking speed: ~1.25 m/s (4.5 km/h)
 */
export function formatDuration(seconds: number): string {
  const mins = Math.ceil(seconds / 60)
  if (mins <= 1) return '1 min walk'
  if (mins < 60) return `${mins} mins walk`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours} hr ${remainingMins} min`
}
