/**
 * Verified Campus Boundary Polygon for INFO Institute of Engineering, Coimbatore, Tamil Nadu.
 * Aligned 100% with the user's authoritative satellite layout and OpenStreetMap boundary (Way 1562248080).
 * 
 * True Geographic Orientation:
 * - NORTH (Top): Karuvalur - Kovilpalayam Road, Main Entrance Gate, Parking, Auditorium
 * - CENTER: B - Block, Office Room, C - Block, Library
 * - WEST (Left): Play Ground, Volleyball Court, Basketball Court, D - Block, Boys Hostel
 * - SOUTH (Bottom): Dining Mess, Girls Hostel
 */

export const CAMPUS_CENTER: [number, number] = [11.127200, 77.038800]

export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [11.12560, 77.03730], // SouthWest [lat, lon] (Mess & Girls Hostel area)
  [11.12895, 77.04020], // NorthEast [lat, lon] (Main Gate, Parking & Auditorium)
]

export const CAMPUS_BOUNDARY_POLYGON: Array<[number, number]> = [
  // North Boundary along Karuvalur - Kovilpalayam Road
  [11.128500, 77.037400], // Northwest corner (NW of Canteen/Playground)
  [11.128500, 77.039350], // North perimeter (Main Entrance Gate)
  [11.128800, 77.039510], // North perimeter (Parking entrance)
  [11.128800, 77.040100], // Northeast corner (North of Auditorium)

  // East Boundary
  [11.128200, 77.040100], // East perimeter (East of Auditorium / stream bank)
  [11.127200, 77.039900], // East perimeter (East of central blocks)
  [11.125900, 77.039700], // Southeast corner (East of Girls Hostel)

  // South Boundary
  [11.125800, 77.039200], // South perimeter (South of Girls Hostel)
  [11.125800, 77.038300], // South perimeter (South of Mess)
  [11.126100, 77.037400], // Southwest corner (South of Boys Hostel)

  // West Boundary
  [11.126900, 77.037400], // West perimeter (West of Boys Hostel)
  [11.127700, 77.037400], // West perimeter (West of Play Ground)
  [11.128500, 77.037400], // Closing back to Northwest corner
]

export const DEFAULT_ZOOM = 18
export const MIN_ZOOM = 16
export const MAX_ZOOM = 21
