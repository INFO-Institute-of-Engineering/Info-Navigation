import type { CampusLocation } from './campus'

export interface Coordinates {
  latitude: number
  longitude: number
  accuracy?: number
  heading?: number | null
  speed?: number | null
  altitude?: number | null
}

export interface PathNode {
  id: string
  name: string
  latitude: number
  longitude: number
  locationId?: string
}

export type SurfaceType = 'paved' | 'walkway' | 'road' | 'corridor'

export interface PathEdge {
  id: string
  fromNodeId: string
  toNodeId: string
  distance?: number
  surface: SurfaceType
  accessible: boolean
  verified: boolean
}

export interface WalkingStep {
  instruction: string
  distanceMeters: number
  durationSeconds: number
  fromNodeName: string
  toNodeName: string
  coordinate: Coordinates
}

export interface WalkingRoute {
  id: string
  startCoords: Coordinates
  destination: CampusLocation
  pathCoordinates: Array<[number, number]> // [lat, lng] for Leaflet
  nodes: PathNode[]
  edges: PathEdge[]
  totalDistanceMeters: number
  estimatedDurationSeconds: number
  steps: WalkingStep[]
  source: 'verified-campus-network' | 'osrm-pedestrian-fallback'
}

export interface NavigationProgress {
  isActive: boolean
  currentRoute: WalkingRoute | null
  destination: CampusLocation | null
  currentStepIndex: number
  remainingDistanceMeters: number
  remainingDurationSeconds: number
  progressPercentage: number
  isOffRoute: boolean
  isRerouting: boolean
  hasArrived: boolean
}

export interface GeolocationState {
  coords: Coordinates | null
  isLoading: boolean
  error: string | null
  isSupported: boolean
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown'
  isInsideCampus: boolean
  isManual?: boolean
}
