export type CampusCategory = 
  | 'academic'
  | 'admin'
  | 'facility'
  | 'hostel'
  | 'dining'
  | 'sports'
  | 'entrance'
  | 'parking'

export interface BuildingDetails {
  code?: string
  floorsCount?: number
  facilities?: string[]
  notes?: string
}

export interface BlueprintCoordinates {
  x: number
  y: number
  width: number
  height: number
  labelX?: number
  labelY?: number
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean
  elevatorAvailable?: boolean
  notes?: string
}

export interface CampusLocation {
  id: string
  name: string
  category: CampusCategory
  description: string
  latitude: number
  longitude: number
  entranceLatitude?: number
  entranceLongitude?: number
  verified: boolean
  source: string
  color?: string
  buildingInfo?: BuildingDetails
  blueprintCoords?: BlueprintCoordinates
  accessibilityInfo?: AccessibilityInfo
  keywords?: string[]
}

export interface CategoryInfo {
  id: CampusCategory
  label: string
  icon: string
  color: string
}
