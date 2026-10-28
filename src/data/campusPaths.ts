import type { PathNode, PathEdge } from '../types/navigation'
import { calculateHaversineDistance } from '../utils/distance'

/**
 * Authoritative Campus Walkway Network for INFO Institute of Engineering, Coimbatore.
 * Permanently calibrated and verified 1:1 on actual satellite imagery.
 */
export const campusPathNodes: PathNode[] = [
  {
    id: 'node_1',
    name: 'Path Point 1 (canteen)',
    latitude: 11.128037,
    longitude: 77.038737,
    locationId: 'canteen',
  },
  {
    id: 'node_2',
    name: 'Path Point 2',
    latitude: 11.127731,
    longitude: 77.038724,
  },
  {
    id: 'node_3',
    name: 'Path Point 3',
    latitude: 11.12725,
    longitude: 77.038718,
  },
  {
    id: 'node_4',
    name: 'Path Point 4',
    latitude: 11.126887,
    longitude: 77.038684,
  },
  {
    id: 'node_5',
    name: 'Path Point 5 (d-block)',
    latitude: 11.126415,
    longitude: 77.038673,
    locationId: 'd-block',
  },
  {
    id: 'node_6',
    name: 'Path Point 6',
    latitude: 11.127168,
    longitude: 77.03885,
  },
  {
    id: 'node_7',
    name: 'Path Point 7',
    latitude: 11.127239,
    longitude: 77.038853,
  },
  {
    id: 'node_8',
    name: 'Path Point 8 (office-room)',
    latitude: 11.127155,
    longitude: 77.039003,
    locationId: 'office-room',
  },
  {
    id: 'node_9',
    name: 'Path Point 9 (main-entrance)',
    latitude: 11.128076,
    longitude: 77.039499,
    locationId: 'main-entrance',
  },
  {
    id: 'node_10',
    name: 'Path Point 10',
    latitude: 11.1277,
    longitude: 77.039491,
  },
  {
    id: 'node_11',
    name: 'Path Point 11',
    latitude: 11.127637,
    longitude: 77.039416,
  },
  {
    id: 'node_12',
    name: 'Path Point 12 (b-block)',
    latitude: 11.127337,
    longitude: 77.039381,
    locationId: 'b-block',
  },
  {
    id: 'node_13',
    name: 'Path Point 13',
    latitude: 11.127115,
    longitude: 77.03937,
  },
  {
    id: 'node_14',
    name: 'Path Point 14 (c-block)',
    latitude: 11.126892,
    longitude: 77.039365,
    locationId: 'c-block',
  },
  {
    id: 'node_15',
    name: 'Path Point 15',
    latitude: 11.126565,
    longitude: 77.039314,
  },
  {
    id: 'node_16',
    name: 'Path Point 16 (library)',
    latitude: 11.126592,
    longitude: 77.039,
    locationId: 'library',
  },
  {
    id: 'node_17',
    name: 'Path Point 17 (playground)',
    latitude: 11.127771,
    longitude: 77.03834,
    locationId: 'playground',
  },
  {
    id: 'node_18',
    name: 'Path Point 18',
    latitude: 11.127744,
    longitude: 77.038515,
  },
  {
    id: 'node_19',
    name: 'Path Point 19 (volleyball-court)',
    latitude: 11.127476,
    longitude: 77.038536,
    locationId: 'volleyball-court',
  },
  {
    id: 'node_20',
    name: 'Path Point 20 (basketball-court)',
    latitude: 11.12715,
    longitude: 77.038517,
    locationId: 'basketball-court',
  },
  {
    id: 'node_21',
    name: 'Path Point 21 (boys-hostel)',
    latitude: 11.126894,
    longitude: 77.038362,
    locationId: 'boys-hostel',
  },
  {
    id: 'node_22',
    name: 'Path Point 22 (girls-hostel)',
    latitude: 11.126384,
    longitude: 77.038979,
    locationId: 'girls-hostel',
  },
  {
    id: 'node_23',
    name: 'Path Point 23',
    latitude: 11.126405,
    longitude: 77.038847,
  },
  {
    id: 'node_24',
    name: 'Path Point 24 (mess)',
    latitude: 11.12631,
    longitude: 77.038847,
    locationId: 'mess',
  },
  {
    id: 'node_25',
    name: 'Path Point 25',
    latitude: 11.128233,
    longitude: 77.039491,
  },
  {
    id: 'node_26',
    name: 'Path Point 26',
    latitude: 11.128238,
    longitude: 77.039625,
  },
  {
    id: 'node_27',
    name: 'Path Point 27 (parking)',
    latitude: 11.128339,
    longitude: 77.039618,
    locationId: 'parking',
  },
  {
    id: 'node_28',
    name: 'Path Point 28',
    latitude: 11.128247,
    longitude: 77.039703,
  },
  {
    id: 'node_29',
    name: 'Path Point 29 (auditorium)',
    latitude: 11.128508,
    longitude: 77.039739,
    locationId: 'auditorium',
  },
]

export const campusPathEdges: PathEdge[] = [
  {
    id: 'e_node_1_node_2',
    fromNodeId: 'node_1',
    toNodeId: 'node_2',
    distance: 34,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_10_node_11',
    fromNodeId: 'node_10',
    toNodeId: 'node_11',
    distance: 11,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_10_node_9',
    fromNodeId: 'node_10',
    toNodeId: 'node_9',
    distance: 42,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_11_node_12',
    fromNodeId: 'node_11',
    toNodeId: 'node_12',
    distance: 34,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_11_node_2',
    fromNodeId: 'node_11',
    toNodeId: 'node_2',
    distance: 76,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_12_node_13',
    fromNodeId: 'node_12',
    toNodeId: 'node_13',
    distance: 25,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_13_node_14',
    fromNodeId: 'node_13',
    toNodeId: 'node_14',
    distance: 25,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_13_node_8',
    fromNodeId: 'node_13',
    toNodeId: 'node_8',
    distance: 40,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_14_node_15',
    fromNodeId: 'node_14',
    toNodeId: 'node_15',
    distance: 37,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_15_node_16',
    fromNodeId: 'node_15',
    toNodeId: 'node_16',
    distance: 34,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_17_node_18',
    fromNodeId: 'node_17',
    toNodeId: 'node_18',
    distance: 19,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_18_node_19',
    fromNodeId: 'node_18',
    toNodeId: 'node_19',
    distance: 30,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_18_node_2',
    fromNodeId: 'node_18',
    toNodeId: 'node_2',
    distance: 23,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_19_node_20',
    fromNodeId: 'node_19',
    toNodeId: 'node_20',
    distance: 36,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_2_node_3',
    fromNodeId: 'node_2',
    toNodeId: 'node_3',
    distance: 53,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_21_node_4',
    fromNodeId: 'node_21',
    toNodeId: 'node_4',
    distance: 35,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_22_node_23',
    fromNodeId: 'node_22',
    toNodeId: 'node_23',
    distance: 15,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_23_node_24',
    fromNodeId: 'node_23',
    toNodeId: 'node_24',
    distance: 11,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_23_node_5',
    fromNodeId: 'node_23',
    toNodeId: 'node_5',
    distance: 19,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_25_node_26',
    fromNodeId: 'node_25',
    toNodeId: 'node_26',
    distance: 15,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_25_node_9',
    fromNodeId: 'node_25',
    toNodeId: 'node_9',
    distance: 17,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_26_node_27',
    fromNodeId: 'node_26',
    toNodeId: 'node_27',
    distance: 11,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_26_node_28',
    fromNodeId: 'node_26',
    toNodeId: 'node_28',
    distance: 9,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_28_node_29',
    fromNodeId: 'node_28',
    toNodeId: 'node_29',
    distance: 29,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_3_node_4',
    fromNodeId: 'node_3',
    toNodeId: 'node_4',
    distance: 41,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_3_node_6',
    fromNodeId: 'node_3',
    toNodeId: 'node_6',
    distance: 17,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_4_node_5',
    fromNodeId: 'node_4',
    toNodeId: 'node_5',
    distance: 52,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_6_node_7',
    fromNodeId: 'node_6',
    toNodeId: 'node_7',
    distance: 8,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
  {
    id: 'e_node_7_node_8',
    fromNodeId: 'node_7',
    toNodeId: 'node_8',
    distance: 19,
    surface: 'walkway',
    accessible: true,
    verified: true,
  },
]

export const CAMPUS_PATHS_STORAGE_KEY = 'info_campus_verified_paths_v2'
export const CAMPUS_EDGES_STORAGE_KEY = 'info_campus_verified_edges_v2'

export function getStoredCampusPathNodes(): PathNode[] {
  return campusPathNodes
}

export function saveStoredCampusPathNodes(_nodes: PathNode[]) {
  // Permanent source of truth is campusPathNodes
}

export function getStoredCampusPathEdges(): PathEdge[] {
  return campusPathEdges
}

export function saveStoredCampusPathEdges(_edges: PathEdge[]) {
  // Permanent source of truth is campusPathEdges
}

export function resetStoredCampusPaths() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CAMPUS_PATHS_STORAGE_KEY)
    localStorage.removeItem(CAMPUS_EDGES_STORAGE_KEY)
  }
}

export function getCampusNetworkWithDistances() {
  const activeNodes = campusPathNodes
  const activeEdges = campusPathEdges
  const nodeMap = new Map<string, PathNode>()
  activeNodes.forEach((node) => nodeMap.set(node.id, node))

  const edgesWithDistances: PathEdge[] = activeEdges.map((edge) => {
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

  activeNodes.forEach((node) => {
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
    nodes: activeNodes,
    edges: edgesWithDistances,
    nodeMap,
    adjacencyList,
  }
}
