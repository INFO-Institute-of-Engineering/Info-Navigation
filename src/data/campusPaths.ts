import type { PathNode, PathEdge } from '../types/navigation'
import { calculateHaversineDistance } from '../utils/distance'

/**
 * Verified Pedestrian Walkway Graph for INFO Institute of Engineering, Coimbatore.
 * 100% matched to the authoritative user-provided blue route satellite layout:
 *
 * 1. North Road & Parking Aisle:
 *    - Parking lane down from top near Auditorium
 *    - Crossroad turn West to Main Gate
 * 2. Main Central Avenue:
 *    - South through Main Entrance Gate
 *    - South down central avenue into B - Block
 * 3. Horizontal Avenue Connector:
 *    - Branching West from Central Avenue (above B-Block lawn) to Western Corridor
 * 4. Western Corridor (North-South spine on West):
 *    - North to Canteen (with 90-deg turn into Canteen)
 *    - South alongside Volleyball & Basketball courts
 *    - East spur into Office Room
 *    - West spur into Boys Hostel
 *    - West spur into D - Block
 *    - South turn East running above Mess towards Girls Hostel
 *    - South branch into Mess
 * 5. Central Vertical Link:
 *    - Direct vertical link between Office Room and C-Block / Library
 */
export const campusPathNodes: PathNode[] = [
  // --- 1. North Road, Main Gate, Parking & Auditorium ---
  {
    id: 'node_parking_top',
    name: 'Parking North End',
    latitude: 11.128850,
    longitude: 77.039600,
  },
  {
    id: 'node_parking',
    name: 'Campus Parking Bays',
    latitude: 11.128608,
    longitude: 77.039600,
    locationId: 'parking',
  },
  {
    id: 'node_auditorium',
    name: 'College Auditorium Portico',
    latitude: 11.128687,
    longitude: 77.039781,
    locationId: 'auditorium',
  },
  {
    id: 'node_parking_turn',
    name: 'Parking Road Turn',
    latitude: 11.128380,
    longitude: 77.039600,
  },
  {
    id: 'node_gate_north_road',
    name: 'North Road Gate Access',
    latitude: 11.128380,
    longitude: 77.039351,
  },
  {
    id: 'node_gate_main',
    name: 'Main Entrance & Security Arch',
    latitude: 11.128134,
    longitude: 77.039351,
    locationId: 'main-entrance',
  },

  // --- 2. Central Avenue & B-Block ---
  {
    id: 'node_avenue_cross',
    name: 'Main Avenue Crossroad Junction',
    latitude: 11.127850,
    longitude: 77.039351,
  },
  {
    id: 'node_bblock',
    name: 'B - Block Entrance Portico',
    latitude: 11.127450,
    longitude: 77.039351,
    locationId: 'b-block',
  },

  // --- 3. West Crossroad & Western Corridor ---
  {
    id: 'node_cross_west_junc',
    name: 'West Crossroad Junction',
    latitude: 11.127850,
    longitude: 77.038574,
  },
  {
    id: 'node_canteen_turn',
    name: 'Canteen Corridor Junction',
    latitude: 11.128055,
    longitude: 77.038574,
  },
  {
    id: 'node_canteen',
    name: 'Canteen & Cafeteria Entrance',
    latitude: 11.128055,
    longitude: 77.038450,
    locationId: 'canteen',
  },
  {
    id: 'node_volleyball',
    name: 'Volleyball Court Walkway',
    latitude: 11.127713,
    longitude: 77.038574,
    locationId: 'volleyball-court',
  },
  {
    id: 'node_basketball',
    name: 'Basketball Court Walkway',
    latitude: 11.127371,
    longitude: 77.038574,
    locationId: 'basketball-court',
  },

  // --- 4. Office Room West Spur & Boys Hostel Spur ---
  {
    id: 'node_office_west_junc',
    name: 'Office Room Walkway Junction',
    latitude: 11.127239,
    longitude: 77.038574,
  },
  {
    id: 'node_office_west',
    name: 'Office Room West Wing Entrance',
    latitude: 11.127239,
    longitude: 77.038950,
  },
  {
    id: 'node_boys_hostel_junc',
    name: 'Boys Hostel Walkway Junction',
    latitude: 11.127050,
    longitude: 77.038574,
  },
  {
    id: 'node_boys_hostel',
    name: 'Boys Hostel Main Entrance',
    latitude: 11.127050,
    longitude: 77.037800,
    locationId: 'boys-hostel',
  },

  // --- 5. Central Vertical Link: Office Room to C-Block to Library ---
  {
    id: 'node_office_room',
    name: 'Office Room (Admin Wing)',
    latitude: 11.127239,
    longitude: 77.039351,
    locationId: 'office-room',
  },
  {
    id: 'node_cblock',
    name: 'C - Block Entrance',
    latitude: 11.127029,
    longitude: 77.039351,
    locationId: 'c-block',
  },
  {
    id: 'node_library',
    name: 'Central Campus Library',
    latitude: 11.126871,
    longitude: 77.039351,
    locationId: 'library',
  },

  // --- 6. D - Block Spur ---
  {
    id: 'node_dblock_junc',
    name: 'D - Block Walkway Junction',
    latitude: 11.126502,
    longitude: 77.038574,
  },
  {
    id: 'node_dblock',
    name: 'D - Block Entrance',
    latitude: 11.126502,
    longitude: 77.038200,
    locationId: 'd-block',
  },

  // --- 7. South Sector: Mess & Girls Hostel ---
  {
    id: 'node_south_corridor_junc',
    name: 'South Corridor Junction',
    latitude: 11.126150,
    longitude: 77.038574,
  },
  {
    id: 'node_mess_junc',
    name: 'Mess Road Junction',
    latitude: 11.126150,
    longitude: 77.038750,
  },
  {
    id: 'node_mess',
    name: 'Dining Mess Entrance',
    latitude: 11.125950,
    longitude: 77.038750,
    locationId: 'mess',
  },
  {
    id: 'node_girls_hostel',
    name: 'Girls Hostel Access Path',
    latitude: 11.126150,
    longitude: 77.039200,
    locationId: 'girls-hostel',
  },
]

export const campusPathEdges: PathEdge[] = [
  // 1. Parking Aisle & Karuvalur Road -> Main Gate
  {
    id: 'e_parking_top_mid',
    fromNodeId: 'node_parking_top',
    toNodeId: 'node_parking',
    surface: 'paved',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_parking_mid_turn',
    fromNodeId: 'node_parking',
    toNodeId: 'node_parking_turn',
    surface: 'paved',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_parking_auditorium',
    fromNodeId: 'node_parking',
    toNodeId: 'node_auditorium',
    surface: 'paved',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_parking_turn_gate_road',
    fromNodeId: 'node_parking_turn',
    toNodeId: 'node_gate_north_road',
    surface: 'paved',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_gate_north_road_gate',
    fromNodeId: 'node_gate_north_road',
    toNodeId: 'node_gate_main',
    surface: 'paved',
    accessible: true,
    verified: true,
  },

  // 2. Main Gate -> Central Avenue -> B-Block
  {
    id: 'e_gate_ave_cross',
    fromNodeId: 'node_gate_main',
    toNodeId: 'node_avenue_cross',
    surface: 'paved',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_ave_cross_bblock',
    fromNodeId: 'node_avenue_cross',
    toNodeId: 'node_bblock',
    surface: 'paved',
    accessible: true,
    verified: true,
  },

  // 3. Horizontal Avenue Connector: Central Avenue Crossroad West to Western Corridor
  {
    id: 'e_ave_cross_west',
    fromNodeId: 'node_avenue_cross',
    toNodeId: 'node_cross_west_junc',
    surface: 'paved',
    accessible: true,
    verified: true,
  },

  // 4. Western Corridor North to Canteen
  {
    id: 'e_cross_west_canteen_turn',
    fromNodeId: 'node_cross_west_junc',
    toNodeId: 'node_canteen_turn',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_canteen_turn_canteen',
    fromNodeId: 'node_canteen_turn',
    toNodeId: 'node_canteen',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },

  // 5. Western Corridor South past Courts
  {
    id: 'e_cross_west_volleyball',
    fromNodeId: 'node_cross_west_junc',
    toNodeId: 'node_volleyball',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_volleyball_basketball',
    fromNodeId: 'node_volleyball',
    toNodeId: 'node_basketball',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },

  // 6. Western Corridor East Spur into Office Room
  {
    id: 'e_basketball_office_junc',
    fromNodeId: 'node_basketball',
    toNodeId: 'node_office_west_junc',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_office_west_spur',
    fromNodeId: 'node_office_west_junc',
    toNodeId: 'node_office_west',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },

  // 7. Western Corridor West Spur into Boys Hostel
  {
    id: 'e_office_junc_boys_junc',
    fromNodeId: 'node_office_west_junc',
    toNodeId: 'node_boys_hostel_junc',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_boys_junc_spur',
    fromNodeId: 'node_boys_hostel_junc',
    toNodeId: 'node_boys_hostel',
    surface: 'paved',
    accessible: true,
    verified: true,
  },

  // 8. Western Corridor South to D-Block
  {
    id: 'e_boys_junc_dblock_junc',
    fromNodeId: 'node_boys_hostel_junc',
    toNodeId: 'node_dblock_junc',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_dblock_junc_spur',
    fromNodeId: 'node_dblock_junc',
    toNodeId: 'node_dblock',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },

  // 9. Western Corridor South to Mess & Girls Hostel
  {
    id: 'e_dblock_junc_south_junc',
    fromNodeId: 'node_dblock_junc',
    toNodeId: 'node_south_corridor_junc',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_south_junc_mess_junc',
    fromNodeId: 'node_south_corridor_junc',
    toNodeId: 'node_mess_junc',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_mess_junc_mess',
    fromNodeId: 'node_mess_junc',
    toNodeId: 'node_mess',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_mess_junc_girls',
    fromNodeId: 'node_mess_junc',
    toNodeId: 'node_girls_hostel',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },

  // 10. Central Vertical Link: Office Room to C-Block to Library
  {
    id: 'e_office_cblock',
    fromNodeId: 'node_office_room',
    toNodeId: 'node_cblock',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_cblock_library',
    fromNodeId: 'node_cblock',
    toNodeId: 'node_library',
    surface: 'walkway',
    accessible: true,
    verified: true,
  },

  // --- Verified Indoor Corridors (for routing across buildings, excluded from outdoor map) ---
  {
    id: 'e_bblock_office_indoor',
    fromNodeId: 'node_bblock',
    toNodeId: 'node_office_room',
    surface: 'corridor',
    accessible: true,
    verified: true,
    isIndoor: true,
  },
  {
    id: 'e_office_west_office_indoor',
    fromNodeId: 'node_office_west',
    toNodeId: 'node_office_room',
    surface: 'corridor',
    accessible: true,
    verified: true,
    isIndoor: true,
  },
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
