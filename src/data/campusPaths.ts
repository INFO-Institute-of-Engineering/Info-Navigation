import type { PathNode, PathEdge } from '../types/navigation'
import { calculateHaversineDistance } from '../utils/distance'

/**
 * Pedestrian Walkway Graph for INFO Institute of Engineering, Coimbatore.
 * Strictly 1:1 with the blue lines drawn on the authoritative campus satellite image:
 * 1. North road from Main Entrance arch to Parking bays and Auditorium
 * 2. Southbound Avenue to central crossroad in front of B-Block
 * 3. Crossroad heading West to the main Western Corridor
 * 4. Western Corridor going North to Canteen, and South past courts to Boys Hostel and D-Block
 * 5. Single central spur between Office Room and Library connecting B-Block & C-Block
 * 6. Southern terminus branching into Mess and Girls Hostel
 */
export const campusPathNodes: PathNode[] = [
  // 1. Main Entrance, Parking & Auditorium
  { id: 'node_gate_main', name: 'Main Entrance & Security Arch', latitude: 11.128134, longitude: 77.039351, locationId: 'main-entrance' },
  { id: 'node_gate_north_road', name: 'North Road Gate Access', latitude: 11.128345, longitude: 77.039351 },
  { id: 'node_gate_east_turn', name: 'Parking & Auditorium Approach', latitude: 11.128345, longitude: 77.039512 },
  { id: 'node_parking', name: 'Campus Parking Bays', latitude: 11.128529, longitude: 77.039512, locationId: 'parking' },
  { id: 'node_auditorium', name: 'College Auditorium Portico', latitude: 11.128555, longitude: 77.039673, locationId: 'auditorium' },

  // 2. Central Entrance Avenue
  { id: 'node_avenue_mid', name: 'Central Driveway Avenue', latitude: 11.127818, longitude: 77.039378 },
  { id: 'node_avenue_cross', name: 'Main Avenue Crossroad Junction', latitude: 11.127634, longitude: 77.039378 },
  { id: 'node_bblock', name: 'B - Block Entrance', latitude: 11.127397, longitude: 77.039298, locationId: 'b-block' },

  // 3. West Crossroad & Western Corridor
  { id: 'node_cross_west_junc', name: 'West Crossroad Junction', latitude: 11.127634, longitude: 77.038574 },
  { id: 'node_volleyball_junc', name: 'Volleyball Court Walkway', latitude: 11.127713, longitude: 77.038574, locationId: 'volleyball-court' },
  { id: 'node_canteen_junc', name: 'Canteen Walkway Approach', latitude: 11.128055, longitude: 77.038574 },
  { id: 'node_canteen', name: 'Canteen & Cafeteria', latitude: 11.128055, longitude: 77.038493, locationId: 'canteen' },
  { id: 'node_west_mid_junc', name: 'Basketball Court Entrance & Mid Corridor', latitude: 11.127371, longitude: 77.038574, locationId: 'basketball-court' },

  // 4. Boys Hostel Spur
  { id: 'node_boys_hostel_junc', name: 'Boys Hostel Path Junction', latitude: 11.127108, longitude: 77.038574 },
  { id: 'node_boys_hostel_spur', name: 'Boys Hostel Approach Road', latitude: 11.127108, longitude: 77.038064 },
  { id: 'node_boys_hostel', name: 'Boys Hostel Main Entrance', latitude: 11.126844, longitude: 77.037796, locationId: 'boys-hostel' },

  // 5. Central Academic Complex Link (between Office Room and Library)
  { id: 'node_central_breezeway_west', name: 'Central Complex West Approach', latitude: 11.127134, longitude: 77.038815 },
  { id: 'node_central_courtyard_link', name: 'Courtyard Breezeway Link', latitude: 11.127134, longitude: 77.039378 },
  { id: 'node_office_room', name: 'Office Room Entrance', latitude: 11.127239, longitude: 77.039298, locationId: 'office-room' },
  { id: 'node_cblock', name: 'C - Block Laboratory Entrance', latitude: 11.127029, longitude: 77.039298, locationId: 'c-block' },
  { id: 'node_library', name: 'Campus Library Entrance', latitude: 11.126871, longitude: 77.039298, locationId: 'library' },

  // 6. D - Block Spur
  { id: 'node_dblock_junc', name: 'D - Block Walkway Junction', latitude: 11.126502, longitude: 77.038574 },
  { id: 'node_dblock', name: 'D - Block Entrance Portico', latitude: 11.126502, longitude: 77.038359, locationId: 'd-block' },

  // 7. South Sector (Mess & Girls Hostel)
  { id: 'node_south_corridor_junc', name: 'South Corridor Junction', latitude: 11.126160, longitude: 77.038574 },
  { id: 'node_mess', name: 'Dining Mess Entrance', latitude: 11.126108, longitude: 77.038708, locationId: 'mess' },
  { id: 'node_girls_hostel_path', name: 'Girls Hostel Access Walkway', latitude: 11.126134, longitude: 77.039030 },
  { id: 'node_girls_hostel', name: 'Girls Hostel Main Gate', latitude: 11.126029, longitude: 77.039351, locationId: 'girls-hostel' },
]

export const campusPathEdges: PathEdge[] = [
  // 1. Main Entrance north onto road, east to Parking & Auditorium
  { id: 'e_gate_north_road', fromNodeId: 'node_gate_main', toNodeId: 'node_gate_north_road', surface: 'paved', accessible: true, verified: true },
  { id: 'e_north_road_east_turn', fromNodeId: 'node_gate_north_road', toNodeId: 'node_gate_east_turn', surface: 'paved', accessible: true, verified: true },
  { id: 'e_east_turn_parking', fromNodeId: 'node_gate_east_turn', toNodeId: 'node_parking', surface: 'paved', accessible: true, verified: true },
  { id: 'e_parking_auditorium', fromNodeId: 'node_parking', toNodeId: 'node_auditorium', surface: 'paved', accessible: true, verified: true },

  // 2. Central Avenue southward spine
  { id: 'e_gate_ave_mid', fromNodeId: 'node_gate_main', toNodeId: 'node_avenue_mid', surface: 'paved', accessible: true, verified: true },
  { id: 'e_ave_mid_cross', fromNodeId: 'node_avenue_mid', toNodeId: 'node_avenue_cross', surface: 'paved', accessible: true, verified: true },
  { id: 'e_ave_cross_bblock', fromNodeId: 'node_avenue_cross', toNodeId: 'node_bblock', surface: 'paved', accessible: true, verified: true },

  // 3. Crossroad: Avenue cross heading West to Western Corridor
  { id: 'e_ave_cross_west', fromNodeId: 'node_avenue_cross', toNodeId: 'node_cross_west_junc', surface: 'paved', accessible: true, verified: true },

  // 4. Western Corridor: North past Volleyball Court into Canteen
  { id: 'e_cross_west_volleyball', fromNodeId: 'node_cross_west_junc', toNodeId: 'node_volleyball_junc', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_volleyball_canteen_junc', fromNodeId: 'node_volleyball_junc', toNodeId: 'node_canteen_junc', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_canteen_junc_canteen', fromNodeId: 'node_canteen_junc', toNodeId: 'node_canteen', surface: 'walkway', accessible: true, verified: true },

  // 5. Western Corridor: South past Basketball Court to Boys Hostel & Central Complex
  { id: 'e_cross_west_mid', fromNodeId: 'node_cross_west_junc', toNodeId: 'node_west_mid_junc', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_west_mid_boys_junc', fromNodeId: 'node_west_mid_junc', toNodeId: 'node_boys_hostel_junc', surface: 'walkway', accessible: true, verified: true },

  // 6. Boys Hostel Spur
  { id: 'e_boys_junc_spur', fromNodeId: 'node_boys_hostel_junc', toNodeId: 'node_boys_hostel_spur', surface: 'paved', accessible: true, verified: true },
  { id: 'e_boys_spur_entrance', fromNodeId: 'node_boys_hostel_spur', toNodeId: 'node_boys_hostel', surface: 'paved', accessible: true, verified: true },

  // 7. Central Complex Link (between Office Room and Library)
  { id: 'e_boys_junc_breezeway', fromNodeId: 'node_boys_hostel_junc', toNodeId: 'node_central_breezeway_west', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_breezeway_courtyard', fromNodeId: 'node_central_breezeway_west', toNodeId: 'node_central_courtyard_link', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_courtyard_office', fromNodeId: 'node_central_courtyard_link', toNodeId: 'node_office_room', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_office_bblock', fromNodeId: 'node_office_room', toNodeId: 'node_bblock', surface: 'paved', accessible: true, verified: true },
  { id: 'e_courtyard_cblock', fromNodeId: 'node_central_courtyard_link', toNodeId: 'node_cblock', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_cblock_library', fromNodeId: 'node_cblock', toNodeId: 'node_library', surface: 'walkway', accessible: true, verified: true },

  // 8. Western Corridor south to D - Block
  { id: 'e_boys_junc_dblock_junc', fromNodeId: 'node_boys_hostel_junc', toNodeId: 'node_dblock_junc', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_dblock_junc_dblock', fromNodeId: 'node_dblock_junc', toNodeId: 'node_dblock', surface: 'walkway', accessible: true, verified: true },

  // 9. Western Corridor south to Mess & Girls Hostel
  { id: 'e_dblock_junc_south_junc', fromNodeId: 'node_dblock_junc', toNodeId: 'node_south_corridor_junc', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_south_junc_mess', fromNodeId: 'node_south_corridor_junc', toNodeId: 'node_mess', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_south_junc_gh_path', fromNodeId: 'node_south_corridor_junc', toNodeId: 'node_girls_hostel_path', surface: 'walkway', accessible: true, verified: true },
  { id: 'e_gh_path_girls_hostel', fromNodeId: 'node_girls_hostel_path', toNodeId: 'node_girls_hostel', surface: 'walkway', accessible: true, verified: true },
]

export function getCampusNetworkWithDistances() {
  const nodeMap = new Map<string, PathNode>()
  campusPathNodes.forEach((node) => nodeMap.set(node.id, node))

  const edgesWithDistances: PathEdge[] = campusPathEdges.map((edge) => {
    const from = nodeMap.get(edge.fromNodeId)
    const to = nodeMap.get(edge.toNodeId)
    let dist = edge.distance

    if (!dist && from && to) {
      dist = calculateHaversineDistance(
        { latitude: from.latitude, longitude: from.longitude },
        { latitude: to.latitude, longitude: to.longitude }
      )
    }

    return {
      ...edge,
      distance: dist || 10,
    }
  })

  const adjacencyList = new Map<string, Array<{ targetNodeId: string; edge: PathEdge; distance: number }>>()

  campusPathNodes.forEach((node) => {
    adjacencyList.set(node.id, [])
  })

  edgesWithDistances.forEach((edge) => {
    const dist = edge.distance || 10
    adjacencyList.get(edge.fromNodeId)?.push({
      targetNodeId: edge.toNodeId,
      edge,
      distance: dist,
    })
    adjacencyList.get(edge.toNodeId)?.push({
      targetNodeId: edge.fromNodeId,
      edge,
      distance: dist,
    })
  })

  return {
    nodes: campusPathNodes,
    edges: edgesWithDistances,
    nodeMap,
    adjacencyList,
  }
}
